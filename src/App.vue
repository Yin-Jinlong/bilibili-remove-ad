<template>
    <h-card v-if="show" class="container">
        <template #header>
            设置
        </template>
        <template #default>
            <div class="row">
                显示提示
                <h-switch v-model="showTip"/>
            </div>
            <div class="row">
                <h-check-box v-model="removeADBlockTips">移除广告拦截提示</h-check-box>
            </div>
            <div class="row">
                <h-check-box v-model="removeFloorSingleCard">移除floor-single-card</h-check-box>
            </div>
        </template>
    </h-card>
</template>

<style lang="scss" scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2147483647;
}

.row {
  display: flex;
  align-items: center;
}

</style>

<script setup lang="ts">
import {HCard, HCheckBox, HMessage, HSwitch} from '@yin-jinlong/h-ui'
import {onMounted, ref, watch} from 'vue'

const Key_ShowTip = 'showTip'
const Key_RemoveFloorSingleCard = 'removeFloorSingleCard'
const Key_RemoveADBlockTips = 'removeADBlockTips'

const show = ref(false)
const showTip = ref<boolean>((key(Key_ShowTip) ?? 'true') === 'true')
const removeFloorSingleCard = ref<boolean>(getRemoveFloorSingleCard())
const removeADBlockTips = ref<boolean>((key(Key_RemoveADBlockTips) ?? 'true') === 'true')


function key(name: string, value?: any) {
    if (value === undefined)
        return localStorage.getItem(name)
    else {
        if (value == null)
            localStorage.removeItem(name)
        else
            localStorage.setItem(name, value)
        return value
    }
}

function getRemoveFloorSingleCard(): boolean {
    return key(Key_RemoveFloorSingleCard) === 'true'
}

function setRemoveFloorSingleCard(value: boolean) {
    key(Key_RemoveFloorSingleCard, value)
}

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
    if (removeFloorSingleCard.value) {
        if (card.classList.contains('floor-single-card'))
            card.remove()
    }
    if (
        !card.firstElementChild?.children.length ||
        query(card, 'use')?.getAttribute('xlink:href') === '#palette-ad' ||
        card.firstElementChild?.firstElementChild == null
    )
        card.remove()
}

function run() {

    if (removeADBlockTips.value) {
        removeAdBlockTips()
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
}

function removeAdBlockTips() {
    const div = document.querySelector('#i_cecream .adblock-tips')
    div?.remove()
}

onMounted(() => {
    window.addEventListener('keypress', e => {
        if (e.key === '`') {
            show.value = !show.value
        }
    })
    run()
    if (showTip.value) {
        setTimeout(() => {
            HMessage.show('按`打开设置')
        }, 1000)
    }
})

watch(removeFloorSingleCard, (value) => {
    setRemoveFloorSingleCard(value)
    if (value) {
        Array.from(query(document, '.feed2 .container').children).forEach(removeIfAdNode)
    }
})

watch(showTip, (value) => {
    key(Key_ShowTip, value)
})

watch(removeADBlockTips, (value) => {
    key(Key_RemoveADBlockTips, value)
    if (value) {
        removeAdBlockTips()
    }
})

</script>
