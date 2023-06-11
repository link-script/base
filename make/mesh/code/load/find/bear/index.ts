export function load_codeCard_load_find_bear(
  load: code.MeshLoad,
): void {
  code.assumeLink(load, Link.Tree).nest.forEach((nest, index) => {
    code.load_codeCard_load_find_bear_nestedChildren(
      code.withLink(load, nest, index),
    )
  })
}

export function load_codeCard_load_find_bear_nestedChildren(
  load: code.MeshLoad,
): void {
  const type = code.getLinkHint(load)
  if (type === 'static-term') {
  } else {
    code.throwError(code.generateUnhandledTermCaseError(load))
  }
}
