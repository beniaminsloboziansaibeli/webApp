export const parseQuickAdd = (text: string) => {
  // Try to extract time like 'at 18:00' or '18:00'
  const timeMatch = text.match(/(\d{1,2}:\d{2})/)
  const time = timeMatch ? timeMatch[1] : undefined
  let title = text
  if (timeMatch) {
    title = text.replace(timeMatch[0], '').replace(/\bat\b/gi, '').trim()
  }
  return { title: title || text, time }
}
