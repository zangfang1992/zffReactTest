<template>
    <div class="hello">
        <span>{{ta}}</span>
    </div>
</template>

<script>
    export default {
        name: 'HelloWorld',
        data() {
            return {
                a: ['您', '好', '你', '说', '好', '你', '说', '好', '你', '说', '好', '你', '说', '好', '你', '说', '好', '你', '说'],
                ta: 'dddd',
                time: ''
            }
        },
        mounted() {
            this.test(0);
        },
        methods: {
            test(i) {
                this.time = setTimeout(() => {
                    clearTimeout(this.time)
                    if (i < this.a.length) {
                        this.ta += this.a[i]
                        this.test(i + 1)
                    }
                }, 10000)

            }
        }
    }
