//тут указаны типы для вопроса(тайпскрипт)
export type QuestionOption = {
  id: string
  label: string
  nextQuestionId?: string
}

export type Question = {
  id: string
  text: string
  options: QuestionOption[]
}

export type Answer = {
  questionId: string
  optionId: string
}