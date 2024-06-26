import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import monkey from 'vite-plugin-monkey'
import obfuscator from 'rollup-plugin-obfuscator'

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
                version: '1.1',
                homepage: 'https://github.com/Yin-Jinlong/bilibili-remove-ad',
                homepageURL: 'https://github.com/Yin-Jinlong/bilibili-remove-ad',
                icon: 'https://vitejs.dev/logo.svg',
                namespace: 'npm/vite-plugin-monkey',
                match: ['https://www.bilibili.com/*'],
            },
        }),
        obfuscator({
            options: {
                controlFlowFlattening: false,
                deadCodeInjectionThreshold: 0,
                stringArray: false,
                renameProperties: true
            }
        })
    ],
});
