import allDependenciesForJsTs from "../read_dependencies/js";

export async function readDependenciesFromPromt(language:string) {
  let answerDependencies:string[]=[];
     switch(language){
            case 'Typescript':
            case 'Javascript':
            case 'NextJs':
            case 'ReactJs':
              answerDependencies = allDependenciesForJsTs;
     }       
     return answerDependencies;
}

export default readDependenciesFromPromt;