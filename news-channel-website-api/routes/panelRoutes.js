const express = require('express');
const { getContactPages, updateContactPage, getUsersPages, addUsers, updateUsers, getUsersGroupsPages, updateUsersGroups, addUsersGroups, deleteUsers, updateGroupPermissions, getHomePages, updateHomePage, getSiteSettingsData, updateSocialMedia, updateSiteSettingsData, updatePassword, getDashboard, getKunyePages, updateKunyePage, getBasinPages, updateBasinPage, addBasinPage, deleteBasinPage, getYayinAkisiPages, updateYayinAkisiPage, addYayinAkisiPage, deleteYayinAkisiPage, getCanliYayinPages, updateCanliYayinPage, getProgramsPages, updateProgramPage, addProgramPage, deleteProgramPage, getProgramById, deleteTrailer, deleteEpisode } = require('../controllers/pagesControllers/contactPageController');

const router = express.Router();

router.get('/', (req, res) => {
    const data = [{
        content: {
            text: 'Panel içeriği',
            title: 'Panel',
            content: 'Panel içeriği'
        }
    }];
    res.json(data);
});

// Anasayfa Datas
router.get('/pages/home', getHomePages);

router.put('/pages/home/update', updateHomePage);

router.delete('/pages/home/trailer/delete/:id', deleteTrailer);

router.delete('/pages/home/episode/delete/:id', deleteEpisode);

//Program Datas

router.get('/pages/programs', getProgramsPages);
router.get('/pages/programs/:id', getProgramById);
router.put('/pages/programs/update', updateProgramPage);
router.post('/pages/programs/add', addProgramPage);
router.delete('/pages/programs/delete/:id', deleteProgramPage);

//Yayın Akışı Datas
router.get('/pages/yayin-akisi', getYayinAkisiPages);

router.put('/pages/yayin-akisi/update', updateYayinAkisiPage);


//Canlı Yayın Datas
router.get('/pages/canli-yayin', getCanliYayinPages);

router.put('/pages/canli-yayin/update', updateCanliYayinPage);


//Basın Datas
router.get('/pages/basin', getBasinPages);

router.put('/pages/basin/update', updateBasinPage);

router.post('/pages/basin/add', addBasinPage);

router.delete('/pages/basin/delete/:id', deleteBasinPage);

//Kunye Datas
router.get('/pages/kunye', getKunyePages);

router.put('/pages/kunye/update', updateKunyePage);

/////////

//Dashboard Datas
router.get('/dashboard', getDashboard);

//Social Media Datas
router.put('/socialmedia/update', updateSocialMedia)

//Settings Datas
router.get('/settings/site', getSiteSettingsData);

router.put('/settings/site/update', updateSiteSettingsData);

router.put('/settings/user/password/update', updatePassword);

//Home Page Datas
router.get('/pages/home', getHomePages);

router.put('/pages/home/update', updateHomePage);

//Contact Page Datas
router.get('/pages/contact', getContactPages);

router.put('/pages/contact/update', updateContactPage);

//Users List Datas
router.get('/users/list', getUsersPages);

router.post('/users/list/add', addUsers);

router.put('/users/list/update', updateUsers);

router.delete('/users/list/delete/:id', deleteUsers);

//User Group Datas
router.get('/users/groups', getUsersGroupsPages);

router.post('/users/groups/add', addUsersGroups);

router.put('/users/groups/update', updateUsersGroups);

router.put('/users/groups/permissions/update', updateGroupPermissions);

module.exports = router;