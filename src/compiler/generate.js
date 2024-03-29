const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;   // {{aaaaa}}

function genProps(attrs) {
    let str = '';
    for(let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if(attr.name === 'style') {  // 对style做特殊处理
            let styleObj = {};
            attr.value.replace(/([^;:]+):([^;:]+)/g, function() {
                styleObj[arguments[1]] = arguments[2];
            });
            attr.value = styleObj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`;
    }
    return `{${str.slice(0, -1)}}`;
}

function gen(elItem) {
    if(elItem.type === 1) {  // 元素
        return generate(elItem);
    } else {   // 文本
        let text = elItem.text;
        if(!defaultTagRE.test(text)) {
            return `_v('${text}')`;
        } else {
            let tokens = [];
            let match;
            let lastIndex = defaultTagRE.lastIndex = 0;
            while(match = defaultTagRE.exec(text)) {   // 有没有匹配到
                let index = match.index;   // 开始索引

                if(index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)))
                }

                tokens.push(`_s(${match[1].trim()})`)   // JSON.stringify
                lastIndex = index + match[0].length;

            }

            if(lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)));
            }
            return `_v(${tokens.join('+')})`
        }
    }
}
function genChildren(el) {
    let children = el.children;
    if(children) {
        return children.map(c => gen(c)).join(',');
    }
    return false
}

// html字符串 =>  字符串 _c('div', {id: 'app'}, 'hello')
export function generate(el) {  // _c('div')

    // 遍历树 将树拼接成字符串

    let children = genChildren(el);

    let code = `_c('${el.tag}', ${
        el.attrs.length ? genProps(el.attrs) : 'undefined'
    }${
        children ? `,${children}` : ''
    })`;

    return code
}
