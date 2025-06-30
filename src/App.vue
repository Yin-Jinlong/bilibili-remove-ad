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

function removeFloorSingleCards(container: Element) {
    if (removeFloorSingleCard.value)
        container.querySelectorAll('.floor-single-card').forEach(e => {
            e.remove()
        })
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

        function remove() {
            let list = container!.querySelectorAll('.bili-feed-card>div:last-child>div:empty,.bili-video-card__stats--left:empty')
            for (let i = 0; i < list.length; i++) {
                let p = list[i].parentElement
                while (p?.className?.includes('feed-card') === false) {
                    p = p.parentElement!!
                }
                if (p?.parentElement?.className.includes('feed-card'))
                    p = p.parentElement
                p?.remove()
            }
        }

        new MutationObserver((_) => {
            remove()
            removeFloorSingleCards(container)
        }).observe(container, {
            childList: true,
        })
        remove()
        removeFloorSingleCards(container)
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
        removeFloorSingleCards(query(document, '.feed2 .container'))
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
