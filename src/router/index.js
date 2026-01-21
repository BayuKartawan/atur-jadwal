import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import SchedulePage from '../page/SchedulePage.vue'
import DataMasterPage from '../page/DataMasterPage.vue'
import AllocationPage from '../page/AllocationPage.vue'
import CurriculumPage from '../page/CurriculumPage.vue'
import WaliKelasPage from '../page/WaliKelasPage.vue'
import RekapPage from '../page/RekapPage.vue'
import TeacherSchedulePage from '../page/TeacherSchedulePage.vue'
import AboutPage from '../page/AboutPage.vue'

const routes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '',
                redirect: '/about'
            },
            {
                path: 'schedule',
                name: 'schedule',
                component: SchedulePage
            },
            {
                path: 'teacher-schedule',
                name: 'teacher-schedule',
                component: TeacherSchedulePage
            },
            {
                path: 'data-master',
                name: 'data-master',
                component: DataMasterPage
            },
            {
                path: 'allocation',
                name: 'allocation',
                component: AllocationPage
            },
            {
                path: 'curriculum',
                name: 'curriculum',
                component: CurriculumPage
            },
            {
                path: 'wali-kelas',
                name: 'wali-kelas',
                component: WaliKelasPage
            },
            {
                path: 'rekap',
                name: 'rekap',
                component: RekapPage
            },
            {
                path: 'about',
                name: 'about',
                component: AboutPage
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
