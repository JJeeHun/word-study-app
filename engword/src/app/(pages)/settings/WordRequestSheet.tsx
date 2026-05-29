'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { wordRequestRemoteApi } from '@/api/remote/word-request.remote.api'
import { useAuthStore } from '@/stores/auth.store'

const schema = z.object({
  text: z.string().min(1, '단어를 입력해주세요'),
  meaning: z.string().min(1, '의미를 입력해주세요'),
  domain: z.string().min(1, '도메인을 입력해주세요'),
  part_of_speech: z.enum(['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction']),
  difficulty: z.number().min(1).max(5),
  frequency: z.number().min(1).max(5),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
}

export function WordRequestSheet({ open, onClose }: Props) {
  const { isLoggedIn } = useAuthStore()
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { difficulty: 3, frequency: 3, part_of_speech: 'noun' },
  })

  if (!open) return null

  const onSubmit = async (values: FormValues) => {
    const result = await wordRequestRemoteApi.request({ ...values })
    if (result.ok) {
      setSuccess(true)
      reset()
      setTimeout(() => { setSuccess(false); onClose() }, 1500)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-50 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
        <h2 className="text-base font-semibold">단어 추가 요청</h2>

        {!isLoggedIn ? (
          <p className="text-sm text-muted-foreground">로그인 후 이용할 수 있어요</p>
        ) : success ? (
          <p className="text-sm text-primary text-center py-4">요청이 완료됐어요!</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {[
              { name: 'text', label: '단어', placeholder: 'e.g. ubiquitous' },
              { name: 'meaning', label: '의미', placeholder: '어디에나 있는' },
              { name: 'domain', label: '도메인', placeholder: 'GENERAL' },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="text-xs text-muted-foreground">{label}</label>
                <input
                  {...register(name as keyof FormValues)}
                  placeholder={placeholder}
                  className="w-full h-10 px-3 mt-1 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors[name as keyof FormValues] && (
                  <p className="text-xs text-destructive mt-0.5">
                    {errors[name as keyof FormValues]?.message as string}
                  </p>
                )}
              </div>
            ))}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40"
            >
              {isSubmitting ? '요청 중...' : '요청하기'}
            </button>
          </form>
        )}
      </div>
    </>
  )
}
