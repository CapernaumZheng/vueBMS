// 置空Form表单的方法，将表单数据对象所有属性的值置为null
export function emptyForm(current, formData) {
  for (var value in formData) {
    current.$set(formData, value, null)
  }
}

// 重置清空Form表单并重置校验
export function clearFormData(current, formName, formData) {
  if (current && current.$refs[formName]) {
    current.$refs[formName].resetFields()
  }
  emptyForm(current, formData)
}
