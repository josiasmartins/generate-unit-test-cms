let cms_response = [];
const generate_code__textarea = document.querySelector('.generate-code__textarea');
const insert__textarea = document.querySelector('.insert__textarea');
const generator_button = document.querySelector('.generator-button');

function extractObject(cms) {
    console.log(cms, "cms");
    const nome_component = cms.step.components.type;
    const comp = cms.step.components.component[nome_component];

    for (let name in comp) {
        let objeto = {
            nome: name,
            valor: comp[name]
        };

        cms_response.push(objeto);

        console.log(cms_response);
    };

    console.log(cms_response, "cms response");
    generateCode(nome_component, comp);
}

function transformObjectJs(value) {
    return JSON.parse(value);
}

function generateCode(nameComponent, component_object) {

    addConst(nameComponent, component_object);
    
    for (let object of cms_response) {
        generate_code__textarea.value += `
            pm.test("Contains ${object.nome} with correctly text", function () {
            pm.expect(pm.response.text()).to.include("${object.nome}");
            pm.expect(fields.${object.nome}).to.eql(${verifyType(object.valor)});
        });
        `;

        //generate_code__textarea.value += '\n';
    }
}

function verifyType(object) {
    if (typeof object == 'string') return `"${object}"`;

    return object;
}

function addConst(nameComponent, component_object) {
    const lenght = Object.keys(component_object).length;
    generate_code__textarea.value = `
        // Verifica a quantidade de campos associado ao componente ${nameComponent}
        var data = pm.response.json();
        var fields = data.step.components.component["${nameComponent}"];
        var totalField = Object.keys(fields).length;

        pm.test("The number of fields is correct | Total fields must be ${lenght}", function () {
            pm.expect(totalField).to.eql(${lenght});
        });

        // Verifica campos associados ao componente e os valores do mesmo
    `;
}

generator_button.addEventListener('click', () => extractObject(transformObjectJs(insert__textarea.value)));



// import { download } from "./mocks.js";

// const gerador = (cms) => {

//     const generate = function(mock) {
//         mock = download;
    
//         mock.components.component
//         console.log(mock);
    
//         document.querySelector('.mock')
    
//     }
    
//     function extractObject(cms) {

//         let objeto = [];
    
//         const nome_component = cms.step.components.type;
//         const comp = cms.step.components.component[nome_component];
//         for (let name in comp) {
//             let objeto = {
//                 nome: name,
//                 valor: comp[name]
//             };
//             this.objeto.push(objeto);
    
//             if (typeof objeto.valor == 'object') {
//                 for (let nome2 in objeto.valor) {
//                     let objeto2 = {
//                         nome2: nome2,
//                         valor2: objeto.valor[nome2]
//                     };
//                     this.objeto.push(objeto2);
//                     console.log(objeto2, "objeto 2");
    
//                    if (typeof objeto2.valor2 == 'object') {
//                     for (let nome3 in objeto2.valor2) {
//                         let objeto3 = {
//                             nome3: nome3,
//                             valor3: objeto2.valor[nome3]
//                         };
//                         this.objeto.push(objeto3);
//                         console.log(objeto3, "objeto 3");
//                     }
//                    }
//                 }
//             }
//             console.log(objeto)
//         }

//         return objeto;
//     }

//     function extractObject2(cms) {
    
//         const nome_component = cms.step.components.type;
//         const comp = cms.step.components.component[nome_component];
//         for (let name in comp) {
//             let objeto = {
//                 nome: name,
//                 valor: comp[name]
//             };
    
//             if (typeof objeto.valor == 'object') {
//                 for (let nome2 in objeto.valor) {
//                     let objeto2 = {
//                         nome2: nome2,
//                         valor2: objeto.valor[nome2]
//                     };
//                     console.log(objeto2, "objeto 2");
//                 }
//             }
//             console.log(objeto)
//         }
//     }

//     function extractObject3(cms) {
    
//         const nome_component = cms.step.components.type;
//         const comp = cms.step.components.component[nome_component];
//         for (let name in comp) {
//             let objeto = {
//                 nome: name,
//                 valor: comp[name]
//             };

//             this.objeto.push(objeto)
    
//             console.log(objeto)
//         }
//     }

//     function inputCms() {
//         document.querySelector('#cms').va
//     }

//     function replaceUrl() {
//         document.querySelector('.toggle').value == "hk";

//     }

//     return {
//         extractObject
//     }

// }



// extractObject(download);