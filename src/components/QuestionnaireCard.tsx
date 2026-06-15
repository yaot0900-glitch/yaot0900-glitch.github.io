import { motion } from 'framer-motion'
import type { QuestionnaireQuestion } from '../data/questionnaire'

interface Props {
  question: QuestionnaireQuestion
  value: string
  onChange: (questionId: string, value: string) => void
  index: number
  showError?: boolean
}

export default function QuestionnaireCard({ question, value, onChange, index, showError }: Props) {
  const hasError = showError && !value

  return (
    <motion.div
      className={`glass-card p-4 lg:p-5 text-left ${hasError ? 'border-danger/40 ring-1 ring-danger/20' : ''}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      {/* 分类标签 */}
      {question.category && (
        <span className="inline-block text-xs text-accent bg-accent/10 rounded-full px-2.5 py-0.5 mb-2">
          {question.category}
        </span>
      )}

      {/* 题号 + 题目 */}
      <p className="text-text-primary text-base lg:text-lg font-medium mb-3 leading-relaxed whitespace-pre-line">
        <span className="text-accent font-bold mr-1">{index + 1}.</span>
        {question.text}
      </p>

      {/* 题型渲染 */}
      {question.type === 'likert-5' && (
        <LikertInput
          options={question.options || []}
          value={value}
          onChange={(v) => onChange(question.id, v)}
        />
      )}

      {question.type === 'single' && (
        <SingleChoiceInput
          options={question.options || []}
          value={value}
          onChange={(v) => onChange(question.id, v)}
        />
      )}

      {question.type === 'text' && (
        <TextInput
          value={value}
          onChange={(v) => onChange(question.id, v)}
        />
      )}

      {hasError && (
        <p className="text-danger text-sm mt-2">请回答此题</p>
      )}
    </motion.div>
  )
}

// ============ 子组件 ============

function LikertInput({ options, value, onChange }: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-1.5 lg:gap-3">
      <span className="text-text-muted text-xs lg:text-sm shrink-0">非常不同意</span>
      <div className="flex gap-1.5 lg:gap-2.5 flex-1 justify-center">
        {options.map(opt => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-sm lg:text-base font-medium transition-all duration-150 ${
                selected
                  ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-110'
                  : 'bg-white border-2 border-[#D4C8B0] text-text-muted hover:border-accent/50 hover:text-accent'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
      <span className="text-text-muted text-xs lg:text-sm shrink-0">非常同意</span>
    </div>
  )
}

function SingleChoiceInput({ options, value, onChange }: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      {options.map(opt => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`w-full text-left p-3 lg:p-3.5 rounded-xl border transition-all text-sm lg:text-base leading-relaxed ${
              selected
                ? 'border-accent/60 bg-accent/8 text-accent font-medium'
                : 'border-[#D4C8B0] text-text-secondary hover:border-accent/30 hover:bg-[#FFFAF2]'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function TextInput({ value, onChange }: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="请输入你的想法..."
      rows={3}
      className="w-full p-3 rounded-xl border border-[#D4C8B0] bg-white text-text-primary text-sm lg:text-base resize-none focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-muted"
    />
  )
}
