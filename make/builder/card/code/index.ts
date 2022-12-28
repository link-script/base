import {
  APIInputType,
  AST,
  ASTCodeModuleType,
  ASTPartialType,
  Base,
  api,
} from '~'

export * from './bear'
export * from './bind'
export * from './bond'
export * from './call'
export * from './face'
export * from './form'
export * from './fuse'
export * from './head'
export * from './hide'
export * from './hold'
export * from './host'
export * from './like'
export * from './link'
export * from './load'
export * from './note'
export * from './risk'
export * from './save'
export * from './show'
export * from './slot'
export * from './stem'
export * from './suit'
export * from './take'
export * from './task'
export * from './test'
export * from './time'
export * from './tree'
export * from './wait'
export * from './walk'
export * from './zone'

export function handle_codeCard(
  base: Base,
  link: string,
): void {
  api.process_codeCard(base, link)
  api.resolve_codeCard(base, link)
}

export function process_codeCard(
  base: Base,
  link: string,
): void {
  const text = api.readTextFile(base, link)
  const textTree = api.parseTextIntoTree(text)
  const linkHost = api.getLinkHost(link)
  const card = base.card(link)
  const seed: ASTPartialType<AST.CodeModule> = {
    allSuitAST: {},
    allTaskAST: {},
    allTestAST: {},
    allTreeAST: {},
    allZoneAST: {},
    base,
    bearList: [],
    dependencyList: [],
    directory: linkHost,
    faceAST: {},
    formAST: {},
    hookAST: {},
    hostAST: {},
    like: AST.CodeModule,
    loadList: [],
    parseTree: textTree,
    partial: true,
    path: link,
    publicFaceAST: {},
    publicFormAST: {},
    publicHostAST: {},
    publicSuitAST: {},
    publicTaskAST: {},
    publicTestAST: {},
    publicTreeAST: {},
    publicZoneAST: {},
    textByLine: text.split('\n'),
  }
  const input: APIInputType = {
    card: seed,
    lexicalScope: api.createScope(seed),
    objectScope: api.createScope(seed),
  }

  card.bind(seed)

  api.assertNest(textTree)

  textTree.nest.forEach((nest, index) => {
    api.process_codeCard_nestedChildren(
      api.extendWithNestScope(input, {
        index,
        nest,
      }),
    )
  })

  // this.mintCodeCardAST(fork)
}

export function process_codeCard_nestedChildren(
  input: APIInputType,
): void {
  const type = api.determineNestType(input)
  switch (type) {
    case 'dynamic-text':
    case 'dynamic-term':
      api.throwError(
        api.generateUnhandledTermInterpolationError(input),
      )
      break
    case 'static-term':
      api.process_codeCard_nestedChildren_staticTerm(input)
      break
  }
}

export function process_codeCard_nestedChildren_staticTerm(
  input: APIInputType,
): void {
  const term = api.resolveStaticTermFromNest(input)
  switch (term) {
    case 'bear': {
      api.process_codeCard_bear(input)
      break
    }
    case 'load': {
      api.process_codeCard_load(input)
      break
    }
    case 'fuse': {
      api.process_codeCard_fuse(input)
      break
    }
    case 'tree': {
      api.process_codeCard_tree(input)
      break
    }
    case 'face': {
      api.process_codeCard_face(input)
      break
    }
    case 'host': {
      api.process_codeCard_host(input)
      break
    }
    case 'form': {
      api.process_codeCard_form(input)
      break
    }
    case 'suit': {
      api.process_codeCard_suit(input)
      break
    }
    case 'task': {
      api.process_codeCard_task(input)
      break
    }
    case 'note': {
      api.process_codeCard_note(input)
      break
    }
    default: {
      api.throwError(api.generateUnknownTermError(input))
    }
  }
}

export function resolve_codeCard(
  base: Base,
  link: string,
): void {
  const card = base.card(link)
  api.assertAST(card.seed, AST.CodeModule)

  card.seed.loadList.forEach(load => {})
  card.seed.bearList.forEach(bear => {
    api.handle_codeCard(base, bear.link)
  })
}
