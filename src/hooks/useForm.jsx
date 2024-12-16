import { useState } from 'react'

const useForm = (initialState) => {
  const [formValues, setFormValues] = useState(initialState)

  const reset = () => setFormValues(initialState)

  const handleInputChange = (e) => {
    const { value, name } = e.target

    setFormValues({
      ...formValues,
      [name]: value
    })
  }

  return { formValues, handleInputChange, reset }
}

export default useForm