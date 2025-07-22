import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions } from '../data/questions'
import { recommendationsByPath } from '../data/recommendations'
import type { Answer, Question } from '../types/Question'

const QuestionBlock = () => {
  const [answers, setAnswers] = useState<Answer[]>([])
  const [currentQuestionId, setCurrentQuestionId] = useState('q1')
  const [finalRecommendation, setFinalRecommendation] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const getQuestionById = (id: string): Question | undefined =>
    questions.find(q => q.id === id)

  const handleAnswer = (questionId: string, optionId: string, nextId?: string) => {
    const newAnswers = [...answers.filter(a => a.questionId !== questionId), { questionId, optionId }]
    setAnswers(newAnswers)

    if (nextId) {
      setCurrentQuestionId(nextId)
    } else {
      const key = `${questionId}:${optionId}`
      const recommendation = recommendationsByPath[key] || 'Пожалуйста, проконсультируйтесь с врачом.'
      setFinalRecommendation(recommendation)
    }
  }

  const handleBack = () => {
    const newAnswers = [...answers]
    const last = newAnswers.pop()
    setAnswers(newAnswers)
    setFinalRecommendation(null)
    setCurrentQuestionId(last?.questionId || 'q1')
  }

  const handleRestart = () => {
    setAnswers([])
    setCurrentQuestionId('q1')
    setFinalRecommendation(null)
  }

  const answeredQuestions = answers.map((a) => getQuestionById(a.questionId)).filter(Boolean) as Question[]

  const currentQuestion = getQuestionById(currentQuestionId)
  const showCurrentQuestion = currentQuestion && !answers.some(a => a.questionId === currentQuestion.id)

  const questionsToRender = [...answeredQuestions]
  if (showCurrentQuestion && currentQuestion) {
    questionsToRender.push(currentQuestion)
  }

  const getSelectedOption = (questionId: string) =>
    answers.find(a => a.questionId === questionId)?.optionId

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [questionsToRender.length, finalRecommendation])

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg p-8 md:w-4xl mx-auto space-y-6 overflow-y-auto max-h-[80vh] max-md:max-h-full max-md:max-w-full"
      style={{ scrollbarWidth: `none` }}
      layout
      ref={containerRef}
    >
      <h1 className="text-5xl font-bold text-center">Медицинский тест</h1>

      <AnimatePresence mode="wait">
        <motion.div layout>
          {questionsToRender.map((q) => {
            const selectedOptionId = getSelectedOption(q.id)

            return (
              <motion.div
                className="mt-6"
                key={q.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                layout
              >
                <p className="font-semibold text-lg mb-4 text-gray-900">{q.text}</p>
                <div className="grid grid-cols-2 gap-3">
                  {q.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id
                    const isDisabled = !!selectedOptionId

                    return (
                      <button
                        key={opt.id}
                        disabled={isDisabled}
                        onClick={() => handleAnswer(q.id, opt.id, opt.nextQuestionId)}
                        className={`
                          px-4 py-2 rounded-xl border transition-all text-lg
                          break-words text-center whitespace-normal
                          ${isSelected ? 'bg-blue-200 border-0 text-blue-900' : 'bg-[#f3f6f8] border-solid border-transparent text-gray-800'}
                          ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-blue-400 hover:shadow-md'}
                        `}

                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}

          {finalRecommendation && (
            <motion.div
              key="recommendation"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              layout
              className="mt-8"
            >
              <p className="text-lg font-semibold text-gray-900">Рекомендации:</p>
              <p className="text-gray-700 mt-2">{finalRecommendation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.div className="flex justify-between pt-2" layout>
        <button
          onClick={handleBack}
          disabled={answers.length === 0}
          className="bg-gray-200 text-blue-800 font-medium py-2 px-4 rounded-xl hover:bg-gray-300 disabled:opacity-50"
        >
          Назад
        </button>
        <button
          onClick={handleRestart}
          className="bg-blue-100 text-blue-800 font-medium py-2 px-4 rounded-xl hover:bg-blue-200"
        >
          Начать заново
        </button>
      </motion.div>
    </motion.div>
  )
}

export default QuestionBlock
