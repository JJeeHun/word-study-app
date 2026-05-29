import { WordDetailScreen } from './WordDetailScreen'

interface Props {
  params: { id: string }
}

export default function WordDetailPage({ params }: Props) {
  return <WordDetailScreen id={params.id} />
}
