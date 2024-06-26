import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import monkey from 'vite-plugin-monkey'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        minify: 'terser',
        reportCompressedSize: false
    },
    plugins: [
        vue(),
        monkey({
            entry: 'src/main.ts',
            userscript: {
                name: 'bilibili-remove-ad',
                author: 'Yin-Jinlong',
                description: 'B站移除广告',
                version: '2.0',
                homepage: 'https://github.com/Yin-Jinlong/bilibili-remove-ad',
                homepageURL: 'https://github.com/Yin-Jinlong/bilibili-remove-ad',
                icon: 'https://vitejs.dev/logo.svg',
                namespace: 'npm/vite-plugin-monkey',
                match: ['https://www.bilibili.com/*'],
                noframes: true
            },
        }),
    ],
})
