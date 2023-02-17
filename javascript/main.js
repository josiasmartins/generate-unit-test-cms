let cms_response = [];
const generate_code__textarea = document.querySelector('.generate-code__textarea');
const insert__textarea = document.querySelector('.insert__textarea');
const generator_button = document.querySelector('.generator-button');

/**
 * Funcao princiapl que executa todas as complementares
 * 
 * @param cms objeto inteiro do cms 
 */
function main(cms) {
    console.log(cms, "cms");
    const nome_component = cms.step.components.type;
    const comp = cms.step.components.component[nome_component];

    const firstField =  getFirstField(comp)

    percorrerObjetos(comp, cms_response, firstField)

    console.log(cms_response, "cms response");
    generateCode(nome_component, comp);
}

/**
 * 
 * @param comp objeto do componente cms 
 * @returns retorna somente o primeiro campo
 */
function getFirstField(comp) {
    for (let field in comp) {
        return field
    }
}

/**
 * Função que modifca o indece (keys) do array... remove o ponto e adicione o [] com numero
 */
function formaterIndex() {
    const pattern = /.(\d)./;
    for (let index of cms_response) {
        index.keys = index.keys.replace(pattern, '[$1]')
    }
}

/**
 * 
 * @param objeto nome do componente
 * @param novoObjeto array que sera adicionado o objeto iterado
 * @param  keys indece 
 * @param prefixo complemento do indece
 */
function percorrerObjetos(objeto, novoObjeto, keys, prefixo = '') {
    for (let chave in objeto) {
      if (typeof objeto[chave] === 'object' && objeto[chave] !== null) {
        percorrerObjetos(objeto[chave], novoObjeto, keys, prefixo + chave + '.');
      } else {
        novoObjeto.push({ nome: chave, valor: objeto[chave], keys: prefixo + chave, deepKeys: prefixo + keys });
      }
    }

    formaterIndex()
}


/**
 *  Transforma o valor do parametro em JSON
 * 
 * @param value 
 * @returns retorna o objeto parseado
 */
function transformObjectJs(value) {
    return JSON.parse(value);
}

/**
 * Imprime na tag o valor do objeto iterado, concatenando
 * 
 * @param  nameComponent nome do componente cms (type)
 * @param  component_object objeto do componente cms
 */
function generateCode(nameComponent, component_object) {

    addConst(nameComponent, component_object);

    for (let object of cms_response) {
        generate_code__textarea.value += `
            pm.test("Contains ${object.nome} with correctly text", function () {
            pm.expect(pm.response.text()).to.include("${object.nome}");
            pm.expect(fields.${object.keys}).to.eql(${verifyType(object.valor)});
        });
        `;
    }
}

/**
 * Verifca se objeto é igual string... se for adicione o "" no objeto, se não retorne object
 * 
 * @param object objeto
 * @returns objet || "object"
 */
function verifyType(object) {
    if (typeof object == 'string') return `"${object}"`;

    return object;
}

/**
 * Imprime o valor na tag
 * 
 * @param nameComponent nome do componente cms (type)
 * @param component_object objeto do componente cms
 */
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

/**
 * Função que copia o código gerado
 */
function copy() {
    generate_code__textarea.select();
    document.execCommand("copy");
}

generator_button.addEventListener('click', () => main(transformObjectJs(insert__textarea.value)));
