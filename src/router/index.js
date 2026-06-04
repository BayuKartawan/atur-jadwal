import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../tata-letak-layout/TataLetakAplikasi.vue'
import HalamanJadwal from '../halaman/HalamanJadwal.vue'
import HalamanDataMaster from '../halaman/HalamanDataMaster.vue'
import HalamanAlokasi from '../halaman/HalamanAlokasi.vue'
import HalamanKurikulum from '../halaman/HalamanKurikulum.vue'
import HalamanRekap from '../halaman/HalamanRekap.vue'
import HalamanJadwalGuru from '../halaman/HalamanJadwalGuru.vue'
import HalamanJadwalKelas from '../halaman/HalamanJadwalKelas.vue'
import HalamanTentang from '../halaman/HalamanTentang.vue'

import HalamanBeranda from '../halaman/HalamanBeranda.vue'

const routes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '',
                redirect: '/beranda'
            },
            {
                path: 'beranda',
                name: 'beranda',
                component: HalamanBeranda
            },
            {
                path: 'jadwal',
                name: 'jadwal',
                component: HalamanJadwal
            },
            {
                path: 'jadwal-guru',
                name: 'jadwal-guru',
                component: HalamanJadwalGuru
            },
            {
                path: 'jadwal-kelas',
                name: 'jadwal-kelas',
                component: HalamanJadwalKelas
            },
            {
                path: 'data-master',
                redirect: '/data-master/guru'
            },
            {
                path: 'data-master/guru',
                name: 'data-master-guru',
                component: HalamanDataMaster
            },
            {
                path: 'data-master/mapel',
                name: 'data-master-mapel',
                component: HalamanDataMaster
            },
            {
                path: 'data-master/kelas',
                name: 'data-master-kelas',
                component: HalamanDataMaster
            },
            {
                path: 'data-master/jam',
                name: 'data-master-jam',
                component: HalamanDataMaster
            },
            {
                path: 'alokasi',
                name: 'alokasi',
                component: HalamanAlokasi
            },
            {
                path: 'kurikulum',
                name: 'kurikulum',
                component: HalamanKurikulum
            },
            {
                path: 'rekap',
                name: 'rekap',
                component: HalamanRekap
            },
            {
                path: 'tentang',
                name: 'tentang',
                component: HalamanTentang
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
