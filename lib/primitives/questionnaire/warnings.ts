import type {
  QuestionnaireItemDefinition,
  QuestionnaireShortcutMode,
  RegisteredItem,
} from "./shared"

/** Development warnings for Root.items that disagree with themselves or with the rendered parts. */
export function questionnaireWarnings(
  items: readonly QuestionnaireItemDefinition[],
  registered: RegisteredItem[],
  defaultItem: string | undefined,
  shortcuts: QuestionnaireShortcutMode | null
) {
  const warnings: string[] = []
  const definitions = new Map(items.map((item) => [item.name, item]))
  const rendered = new Map(registered.map((item) => [item.name, item]))
  const differs = (subject: string, prop: string, part: string) =>
    warnings.push(
      `${subject} has different ${prop} values in Root.items and Questionnaire.${part}.`
    )

  const names = new Set<string>()
  for (const definition of items) {
    const { name } = definition
    if (names.has(name))
      warnings.push(`Item name "${name}" is defined more than once.`)
    names.add(name)
    const declared = definition.choices ?? []
    const values = new Set<string>()
    for (const { value } of declared) {
      if (values.has(value))
        warnings.push(
          `Choice value "${value}" is defined more than once in item "${name}".`
        )
      values.add(value)
    }

    const item = rendered.get(name)
    if (!item) {
      if (!definition.disabled)
        warnings.push(
          `Item "${name}" is defined but has no rendered Questionnaire.Item.`
        )
      continue
    }
    if (item.disabled !== !!definition.disabled)
      differs(`Item "${name}"`, "disabled", "Item")
    if (item.required !== !!definition.required)
      differs(`Item "${name}"`, "required", "Item")

    const choices = item.controls.flatMap((control) =>
      control.type === "choice"
        ? [{ value: control.value, disabled: control.ownDisabled }]
        : []
    )
    for (const choice of declared) {
      const match = choices.find((other) => other.value === choice.value)
      if (!match)
        warnings.push(
          `Choice "${choice.value}" is defined for item "${name}" but has no rendered Questionnaire.Choice.`
        )
      else if (match.disabled !== !!choice.disabled)
        differs(
          `Choice "${choice.value}" in item "${name}"`,
          "disabled",
          "Choice"
        )
    }
    if (!shortcuts) continue
    for (const choice of choices) {
      if (!values.has(choice.value))
        warnings.push(
          `Rendered choice "${choice.value}" in item "${name}" is missing from Root.items and will not receive a shortcut.`
        )
    }
    const enabledValues = (
      list: readonly { value: string; disabled?: boolean }[]
    ) => list.filter((choice) => !choice.disabled).map((choice) => choice.value)
    const declaredOrder = enabledValues(declared)
    const renderedOrder = enabledValues(choices)
    if (
      declaredOrder.length > 0 &&
      declaredOrder.length === renderedOrder.length &&
      declaredOrder.every((value) => renderedOrder.includes(value)) &&
      declaredOrder.some((value, index) => value !== renderedOrder[index])
    )
      warnings.push(
        `Choice order for item "${name}" differs between Root.items and the rendered Questionnaire.Choice elements.`
      )
  }

  for (const item of registered) {
    if (!item.disabled && !definitions.has(item.name))
      warnings.push(
        `Rendered item "${item.name}" is missing from Root.items and is excluded from the questionnaire collection.`
      )
  }
  const defaultDefinition = defaultItem && definitions.get(defaultItem)
  if (defaultItem && (!defaultDefinition || defaultDefinition.disabled))
    warnings.push(
      `defaultItem "${defaultItem}" does not identify an enabled item. The first enabled item will be used instead.`
    )
  return warnings
}
