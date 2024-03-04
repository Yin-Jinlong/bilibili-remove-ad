/**
 * querySelector
 */
const query = (node: ParentNode, selector: string): Element => node.querySelector(selector) as Element

/**
 * 移除元素（如果是广告）
 * @param card 卡片元素
 */
function removeIfAdNode(card?: Element) {
    if (card?.nodeType !== Node.ELEMENT_NODE)
        return
    if (query(card, 'use')?.getAttribute('xlink:href') === '#palette-ad')
        card.remove()
}

/**
 * 监听卡片元素容器
 * @param container 卡片元素容器
 */
const listen = (container?: Element) => {
    if (!container)
        return
    new MutationObserver((mutationsList) => {
        mutationsList.map((mutation) => mutation.addedNodes[0] as Element)
            .forEach(removeIfAdNode)
    }).observe(container, {
        childList: true
    })
    Array.from(container.children).forEach(removeIfAdNode)
}

listen(query(document, '.feed2 .container'))
