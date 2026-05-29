---
name: engword-front
description: Use when implementing any frontend feature in the engword vocabulary app — components, hooks, state management, UI patterns, error handling, or Storybook tests. Covers React/Next.js coding rules, UI/logic separation, mobile-first layout, and theming.
---

# engword-front

> 공통 규칙은 `engword-common` 참조. 이 문서는 프론트 전용 규칙.

---

## UI / 로직 분리 원칙

컴포넌트는 UI만. 기능 state는 hook이 소유.

```
UI 컴포넌트가 가져도 되는 state
  - isOpen, isHovered, activeTab, inputValue (UI 인터랙션 그 자체)

Hook이 소유해야 하는 state
  - 서버/DB 데이터, 로딩 여부, 에러, 큐 목록, 세션 진행 상태 등
```

```tsx
// ❌ 컴포넌트가 직접 DB 호출
function WordCard({ id }: Props) {
  const [word, setWord] = useState<Word>()
  useEffect(() => { dexie.words.get(id).then(setWord) }, [id])
  ...
}

// ✅ Hook이 데이터 소유, 컴포넌트는 props만 소비
function WordCard({ word, onNext }: WordCardProps) { ... }

function useWord(id: string) {
  const [word, setWord] = useState<Word>()
  useEffect(() => { wordService.getById(id).then(...) }, [id])
  return { word }
}
```

---

## Hook 패턴

Dexie, Supabase, fetch를 hook이 직접 import 금지.  
반드시 API Client를 통해서만 접근.

```ts
// ❌ Dexie 직접
import { db } from '@/infra/dexie'
function useWord(id: string) { db.words.get(id) }

// ❌ fetch 직접
const res = await fetch('/api/words/' + id)

// ✅ API Client 통해서만
import { localWordApi } from '@/api/local/word.local.api'
function useWord(id: string) { localWordApi.getById(id) }
```

### useMessage — alert / confirm 통합 Hook

```ts
type MessageType = 'alert' | 'confirm'

interface MessageOptions {
  type: MessageType
  message: string
  onConfirm?: () => void
}

// hook
function useMessage() {
  const [state, setState] = useState<MessageOptions | null>(null)

  const show = (options: MessageOptions) => setState(options)
  const hide = () => setState(null)

  return { state, show, hide }
}
```

성격이 같은 UI(alert/confirm)는 hook 하나로 추상화. type으로 분기.

---

## 에러 처리 — Error Boundary 중앙화

에러는 한 곳에서 관리. 컴포넌트 내부 try/catch로 직접 처리 금지.

### Custom Error 클래스

```ts
// shared/errors.ts
export class AlertError extends Error {
  readonly kind = 'alert' as const
  constructor(message: string) { super(message) }
}

export class ConfirmError extends Error {
  readonly kind = 'confirm' as const
  constructor(message: string, public readonly onConfirm: () => void) {
    super(message)
  }
}

export class ApiError extends Error {
  readonly kind = 'api' as const
  constructor(message: string, public readonly status?: number) {
    super(message)
  }
}
```

```ts
// 사용: 어디서든 throw로 올리기
throw new AlertError('단어를 찾을 수 없어요.')
throw new ConfirmError('삭제할까요?', () => deleteWord(id))
```

### Error Boundary

ErrorBoundary가 error 인스턴스를 보고 어떤 UI를 보여줄지 결정.  
System alert를 쓸지 Modal을 쓸지는 ErrorBoundary의 책임.

```tsx
// ❌ 컴포넌트가 직접 window.alert()
// ❌ 컴포넌트가 직접 모달 state 관리
// ✅ throw new AlertError('...') 후 ErrorBoundary에게 위임
```

---

## API Client — 오프라인 퍼스트 추상화 경계

Hook/UI는 데이터가 로컬인지 서버인지 알 수 없음. 알 필요도 없음.  
반환은 항상 `Promise<Result<T>>` — 구현체만 다를 뿐.

### Pull vs Push 테이블 구분

| 분류 | 테이블 | 프론트 쓰기 | 로컬 읽기 |
|---|---|---|---|
| 관리자 데이터 | words, sentences, pets | ❌ 읽기 전용 | ✅ (Pull 싱크로 채워짐) |
| 유저 데이터 | learning_records, answer_logs, profiles, user_pets | ✅ 로컬 우선 write | ✅ |

**관리자 데이터는 로컬에서 읽기만.** 서버가 Pull 싱크로 Dexie에 채워줌.  
**유저 데이터는 로컬에 즉시 쓰고**, 백그라운드 싱크로 서버에 반영.

### API Client 구조

```
api/
  _interfaces/          ← input/output 스펙 (interface)
    word.api.ts
    learning.api.ts
  local/                ← Dexie 구현체, 싱글톤
    word.local.api.ts
    learning.local.api.ts
  remote/               ← fetch → 서버, 싱글톤 (싱크 전용)
    sync.remote.api.ts
    _http.ts            ← 공통 fetch 래퍼 (인증 헤더 등)
```

### 읽기 — Stale-While-Revalidate (SWR)

```ts
// 앱 실행 시: 로컬 데이터 즉시 렌더 → 백그라운드에서 서버와 대조
function useWords(filter?: WordFilter) {
  const [words, setWords] = useState<Word[]>([])

  useEffect(() => {
    // 1. 로컬 즉시 렌더
    localWordApi.getAll(filter).then(r => { if (r.ok) setWords(r.data) })

    // 2. 백그라운드 Pull 싱크 (서버 변경분이 있으면 Dexie 갱신 후 재렌더)
    syncService.pullWords().then(() => {
      localWordApi.getAll(filter).then(r => { if (r.ok) setWords(r.data) })
    })
  }, [])

  return { words }
}
```

### 쓰기 — 유저 데이터만 로컬 우선

```ts
// 유저 데이터 쓰기 (learning_records, answer_logs 등)
async function submitAnswer(dto: SubmitAnswerDto) {
  // 1. 로컬 즉시 저장 → UI 즉시 반영, 딜레이 없음
  const result = await localAnswerLogApi.create(dto)
  if (!result.ok) return result

  // 2. 싱크 큐에 적재 (백그라운드에서 서버 전송)
  syncQueue.enqueue({ table: 'answer_logs', action: 'create', payload: dto })

  return result
}
```

관리자 데이터(words) 로컬 write 시도 → 즉시 에러 반환. API Client가 막음.

---

## 싱크 큐 (프론트 영역)

싱크 큐는 프론트가 소유. 백엔드는 단건/일괄 처리 엔드포인트만 제공.

```ts
// sync/sync-queue.ts
interface SyncItem {
  table: string
  action: 'create' | 'update'
  payload: unknown
  enqueuedAt: number
}

class SyncQueue {
  private queue: SyncItem[] = []

  enqueue(item: SyncItem) { this.queue.push(item) }

  async flush() {
    if (this.queue.length === 0) return
    if (!authStore.isLoggedIn) return  // 로그인 필수

    const items = [...this.queue]

    // 큐 크기에 따라 단건 vs 일괄 결정
    if (items.length === 1) {
      await syncRemoteApi.single(items[0])
    } else {
      await syncRemoteApi.batch(items)  // 서버가 트랜잭션으로 처리
    }

    this.queue = this.queue.filter(i => !items.includes(i))
  }
}

export const syncQueue = new SyncQueue()  // 싱글톤
```

- `flush()`는 수동 동기화 버튼 탭 시 호출. 자동 동기화는 주기적으로 `flush()` 호출.
- 로그인 안 된 상태에서 flush 시도 → 큐에 유지, 실행 안 함.
- 큐 적재 후 백그라운드 flush 시도 → 실패해도 UI 블로킹 없음.

---

## 조건부 버튼 비활성화 + 이유 안내

서버 push 조건 미충족 시 관련 버튼 전부 비활성화. 왜 안 되는지 작게 안내.

```tsx
function SyncButton() {
  const { isLoggedIn } = useAuthStore()

  return (
    <div>
      <Button
        onClick={handleSync}
        disabled={!isLoggedIn}
      >
        동기화
      </Button>
      {!isLoggedIn && (
        <p className="text-xs text-muted-foreground mt-1">
          로그인하면 동기화할 수 있어요
        </p>
      )}
    </div>
  )
}
```

조건 종류:
- 로그인 여부 → 동기화, 단어 추가 요청 버튼
- 온라인 여부 → 단어 추가 요청 버튼 (오프라인 UUID 중복 문제, 즉시 서버 전송 필수)

**단어 추가 요청은 온라인 + 로그인 모두 필요. 싱크 큐 우회해서 즉시 서버 전송.**

---

## 전역 상태 — Zustand

서버/DB 데이터를 전역으로 공유해야 할 때만 Zustand 사용.  
UI state는 Zustand 금지 — 컴포넌트 로컬 state로.

```ts
// stores/queue.store.ts
interface QueueStore {
  queue: Word[]
  currentIndex: number
  loadNext: () => Promise<void>
}

export const useQueueStore = create<QueueStore>((set, get) => ({
  queue: [],
  currentIndex: 0,
  loadNext: async () => { ... }
}))
```

---

## 컴포넌트 구조

- 컴포넌트는 반드시 분리. 인라인 JSX 덩어리 금지.
- 특정 화면 전용 컴포넌트는 해당 화면 폴더 하위에 위치.

```
app/
  exam/
    _components/
      QuestionCard.tsx
      QuestionCard.stories.tsx
      ChoiceList.tsx
      ChoiceList.stories.tsx
    page.tsx

components/           ← 공통 컴포넌트만
  ui/                 ← shadcn/ui 기반
  layout/
```

---

## UI 라이브러리 규칙

- **shadcn/ui** 기반으로 컴포넌트 구성
- **Skeleton UI** 필수 — 로딩 시 레이아웃 시프트 방지
- **버튼**: API 요청 중 `disabled` 처리 — 중복 요청 방지

```tsx
function SubmitButton({ onClick, loading }: Props) {
  return (
    <Button onClick={onClick} disabled={loading}>
      {loading ? <Skeleton className="w-16 h-4" /> : '제출'}
    </Button>
  )
}
```

---

## 스타일 — Tailwind + 멀티 테마

- **Tailwind CSS** 사용. 인라인 style 속성 금지.
- **모바일 우선** — 기본이 모바일, PC는 확장.

```tsx
// ❌ PC 먼저
<div className="w-1/2 md:w-full">

// ✅ 모바일 먼저
<div className="w-full md:w-1/2">
```

- **멀티 테마** — CSS 변수 기반. Tailwind `dark:` prefix 또는 `data-theme` attribute 사용.
- 색상 하드코딩 금지 — 반드시 CSS 변수 또는 Tailwind 토큰.

```tsx
// ❌
<div className="bg-white text-black">

// ✅
<div className="bg-background text-foreground">
```

---

## 테스트 — Storybook 필수

모든 컴포넌트와 hook은 Storybook 스토리 작성 후 사용.  
UI 일관성 검증은 Storybook에서 완료.

```ts
// QuestionCard.stories.tsx
export default {
  component: QuestionCard,
} satisfies Meta<typeof QuestionCard>

export const Default: Story = {
  args: { word: '...' , meaning: '...' }
}

export const Loading: Story = {
  args: { loading: true }
}
```

- 최소 스토리: Default, Loading, Error 상태 포함.
- Hook 테스트는 `@storybook/addon-interactions` 활용.

---

## 렌더링 최적화 — State 사용 기준

**state는 화면이 실제로 바뀌어야 할 때만.**

```ts
// ❌ input마다 state → 타이핑 지연, 불필요한 리렌더
const [name, setName] = useState('')
<input value={name} onChange={e => setName(e.target.value)} />

// ✅ react-hook-form — 내부적으로 ref 사용, 제출 시에만 값 참조
const { register, handleSubmit } = useForm<FormValues>()
<input {...register('name')} />
```

**토글/이벤트 트리거 패턴:**

```ts
// 렌더 포인트만 필요할 때 — boolean flip으로 처리
const [isDirty, setIsDirty] = useState(false)
const trigger = () => setIsDirty(v => !v)
// isDirty 값 자체보다 변경 사실(flip)이 useEffect 트리거 역할
```

**판단 기준:**
- 화면 UI가 실제로 달라지는가? → state
- 값만 필요하고 화면은 그대로인가? → ref 또는 react-hook-form

---

## Form — react-hook-form + Zod

form은 react-hook-form 필수. 유효성 검사는 Zod 스키마로.

```ts
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('이메일 형식이 아니에요'),
  password: z.string().min(8, '8자 이상 입력해주세요'),
})

type FormValues = z.infer<typeof schema>

function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      <Button type="submit" disabled={isSubmitting}>로그인</Button>
    </form>
  )
}
```

---

## 코드 스타일

- ES6+ 필수. var 금지. 화살표 함수 선호.
- 구조분해 할당 적극 사용.
- if 문 지양 → 맵/전략 패턴으로 대체.

```ts
// ❌ if 체인
if (type === 'alert') showAlert()
else if (type === 'confirm') showConfirm()

// ✅ 맵 패턴
const handlers: Record<MessageType, () => void> = {
  alert: showAlert,
  confirm: showConfirm,
}
handlers[type]()
```

- 가독성이 우선. 너무 함축적인 코드보다 명확한 코드.
- 함수/변수명은 행동을 설명하는 동사형. `getData` ❌ → `fetchWordById` ✅

---

## 연관 문서
- 공통 규칙 → [[engword-common]]
- 화면 구성 → [[../docs/screens/index]]
- UX 규칙 → [[../docs/screens/exam]], [[../docs/screens/home]]
