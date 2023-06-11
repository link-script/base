export function load_codeCard_slot(load: code.MeshLoad): void {
  code.assumeLink(load, Link.Tree).nest.forEach((nest, index) => {
    load_codeCard_slot_nestedChildren(code.withLink(load, nest, index))
  })
}

export function load_codeCard_slot_nestedChildren(
  load: code.MeshLoad,
): void {
  const type = code.getLinkHint(load)
  switch (type) {
    case LinkHint.StaticTerm:
      const term = code.resolveTermString(load)
      break
    default:
      code.throwError(code.generateUnhandledTermCaseError(load))
  }
}
