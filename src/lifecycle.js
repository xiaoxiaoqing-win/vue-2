
export function lifecycleMixin(Vue) {
    Vue.prototype._update = function(vnode) {
        console.log('update', vnode);
    }
}

export function mountComponent(vm, el) {
    // 更新函数 数据变化 再次调用此函数
    let updateComponent = () => {
        // 1.调用render,生成虚拟dom
        vm._update(vm._render());  // 更新可以调用updateComponent方法
        // 2.用虚拟dom, 生成真实dom
    }

    updateComponent();
}
