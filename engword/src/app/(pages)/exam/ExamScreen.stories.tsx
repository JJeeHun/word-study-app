import type { Meta, StoryObj } from '@storybook/react'
import { TypingMode } from './TypingMode'
import { MultipleChoice } from './MultipleChoice'
import { WrongAnswerSheet } from './WrongAnswerSheet'
import { SessionComplete } from './SessionComplete'

const sampleWord = {
  id: '1',
  text: 'ubiquitous',
  meaning: '어디에나 있는, 편재하는',
  difficulty: 4,
  frequency: 3,
  cefr: 'C1' as const,
  part_of_speech: 'adjective' as const,
  origin: 'Latin',
  domain: 'GENERAL',
  status: '승인' as const,
  created_at: '',
  updated_at: '',
  deleted_at: null,
}

const distractors = ['매우 빠른', '조용한', '강한'].map((m, i) => ({
  ...sampleWord, id: String(i + 2), text: `word${i}`, meaning: m,
}))

// Typing
export const Typing: StoryObj = {
  render: () => (
    <TypingMode word={sampleWord} progress="1 / 10" onCorrect={() => {}} onWrong={() => {}} />
  ),
}

// MultipleChoice
export const Choice: StoryObj = {
  render: () => (
    <MultipleChoice word={sampleWord} allWords={[...distractors]} progress="2 / 10" onCorrect={() => {}} onWrong={() => {}} />
  ),
}

// WrongAnswer
export const Wrong: StoryObj = {
  render: () => (
    <WrongAnswerSheet word={sampleWord} onViewNow={() => {}} onViewLater={() => {}} />
  ),
}

// SessionComplete
export const Complete: StoryObj = {
  render: () => (
    <SessionComplete studied={10} doneCount={3} wrongLater={2} onRetry={() => {}} />
  ),
}

export default {
  title: 'Exam',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
