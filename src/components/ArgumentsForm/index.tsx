import type { PromptArgument } from '../../types/prompt'

interface ArgumentsFormProps {
  arguments: PromptArgument[]
  values: Record<string, string>
  onChange: (values: Record<string, string>) => void
}

export default function ArgumentsForm({ arguments: args, values, onChange }: ArgumentsFormProps) {
  const handleChange = (name: string, value: string) => {
    onChange({ ...values, [name]: value })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Configure Arguments
      </h3>
      
      <div className="space-y-4">
        {args.map((arg) => (
          <div key={arg.name}>
            <label
              htmlFor={arg.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {arg.name}
              {arg.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              id={arg.name}
              value={values[arg.name] || ''}
              onChange={(e) => handleChange(arg.name, e.target.value)}
              placeholder={arg.description}
              className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="mt-1 text-sm text-gray-500">{arg.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
