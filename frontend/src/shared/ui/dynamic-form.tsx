import { Path, useForm } from 'react-hook-form'
import { Input } from '@heroui/react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@heroui/react'

export interface FormField {
  name: string
  label: string
  type: string
  placeholder: string
  required?: boolean
  autoComplete?: string
  endContent?: boolean
  className?: string
  labelEndContent?: React.ReactNode
}

interface DynamicFormFieldsProps<T extends z.ZodType> {
  fields: FormField[]
  schema: T
  onSubmit: (data: z.infer<T>) => void
  children?: React.ReactNode
  className?: string
  submitButton: {
    text: string
    isLoading?: boolean
  }
}

export function DynamicFormFields<T extends z.ZodType>({ 
  fields, 
  schema,
  onSubmit, 
  children,
  className,
  submitButton
}: DynamicFormFieldsProps<T>) {
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({})

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema)
  })

  const toggleVisibility = (fieldName: string) => {
    setVisibleFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      {children}
      <div className="grid gap-6">
        {fields.map((field) => (
          <div key={field.name} className="w-full">
            {field.labelEndContent && (
              <div className="flex justify-between items-center mb-2 mx-[2px]">
                <label className="text-sm text-foreground">{field.label}</label>
                {field.labelEndContent}
              </div>
            )}
            <Input
              {...register(field.name as Path<T>)}
              type={field.endContent ? (visibleFields[field.name] ? 'text' : 'password') : field.type}
              label={field.labelEndContent ? undefined : field.label}
              variant="bordered"
              labelPlacement='outside'
              isInvalid={!!errors[field.name]}
              placeholder={field.placeholder}
              errorMessage={errors[field.name]?.message as string}
              autoComplete={field.autoComplete}
              className={field.className}
              endContent={field.endContent && (
                <button
                  type="button"
                  onClick={() => toggleVisibility(field.name)}
                  className="h-full flex items-center focus:outline-none px-1"
                >
                  {visibleFields[field.name] ? (
                    <EyeSlashIcon className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-neutral-400" />
                  )}
                </button>
              )}
              classNames={{
                label: 'text-foreground',
                input: [
                  'text-foreground',
                  'placeholder:text-foreground-secondary/50',
                  'dark:placeholder:text-foreground-secondary/70',
                  'autofill:bg-background',
                  'autofill:text-foreground',
                  'focus:placeholder:text-transparent'
                ].join(' '),
                errorMessage: 'text-red-500'
              }}
            />
          </div>
        ))}
      </div>
      <Button
        type="submit"
        color="primary"
        size="lg"
        isLoading={submitButton.isLoading}
        className="w-full mt-4"
      >
        {submitButton.text}
      </Button>
    </form>
  )
}