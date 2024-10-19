type SCSSVars = [Vars, Utlities]

type Vars = { [key: string]: string | Vars }

type Utlities = Array<{ [key: string]: any }>

export default SCSSVars
