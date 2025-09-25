// lib/api.ts
import { toast } from "sonner"; // Ensure you import the correct toast function

const test = 1;

const baseUrl = test ? 'http://localhost:3001' : 'https://api.tv42.com.tr';

export const fetchData = async (endpoint: string, id?: unknown) => {
  let fetchUrl = `${baseUrl}/${endpoint}`;
  
  if (id) {
    fetchUrl += `/${id}`; // Eğer id varsa, URL'ye ekle
  }

  const response = await fetch(fetchUrl);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data; // Verileri döndür
};

export const updateData = async (endpoint: string, data: unknown) => {
  const response = await fetch(`${baseUrl}/${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const updatedData = await response.json();
  toast.success(updatedData.message.title, { description: updatedData.message.description });
  return updatedData;
};

// Add veri (Yeni veri eklemek için)
export const addData = async (endpoint: string, data: unknown) => {
  const response = await fetch(`${baseUrl}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const addedData = await response.json();


  if (!response.ok) {
    toast.error(addedData.message.title, { description: addedData.message.description });
  }

  toast.success(addedData.message.title, { description: addedData.message.description });
  return addedData;
};

export const deleteData = async (endpoint: string, id: number) => {
  const response = await fetch(`${baseUrl}/${endpoint}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    toast.error(errorData.message.title, { description: errorData.message.description });
    throw new Error('Network response was not ok');
  }

  const deletedData = await response.json();
  toast.success(deletedData.message.title, { description: deletedData.message.description });
  return deletedData;
};


export const fetchKunyePageData = async () => {
  return await fetchData('api/panel/pages/kunye'); 
}

export const updateKunyePageData = async (data: unknown) => {
  return await updateData('api/panel/pages/kunye/update', data); 
}
// Media partner silme fonksiyonu
export async function deleteMediaPartnerData(id: number) {
  try {
    // Gerçek API çağrısı burada yapılacak
    console.log(`Medya ortağı siliniyor: ID=${id}`);
    
    // Başarılı silme simülasyonu
    return { success: true };
  } catch (error) {
    console.error("Medya ortağı silinirken hata oluştu:", error);
    throw error;
  }
}
// Künye sayfası için API fonksiyonları
export async function fetchTeamData() {
  try {
    // Gerçek API çağrısı burada yapılacak
    // Şimdilik örnek veri döndürelim
    return {
      teamMembers: [
        { id: 1, name: "Ahmet Yılmaz", title: "Genel Yayın Yönetmeni", image: "/team/person1.jpg" },
        { id: 2, name: "Ayşe Kaya", title: "Haber Müdürü", image: "/team/person2.jpg" },
        { id: 3, name: "Mehmet Demir", title: "Spor Editörü", image: "/team/person3.jpg" }
      ]
    };
  } catch (error) {
    console.error("Künye verileri alınırken hata oluştu:", error);
    throw error;
  }
}

export async function updateTeamData(data: unknown) {
  try {
    // Gerçek API çağrısı burada yapılacak
    console.log("Künye verileri güncelleniyor:", data);
    
    // Başarılı güncelleme simülasyonu
    return { success: true };
  } catch (error) {
    console.error("Künye verileri güncellenirken hata oluştu:", error);
    throw error;
  }
}

// Canlı Yayın sayfası için API fonksiyonları
export const fetchLiveStreamData = async () => {
  return await fetchData('api/panel/pages/canli-yayin');
}

export const updateLiveStreamData = async (data: unknown) => {
  return await updateData('api/panel/pages/canli-yayin/update', data); 
}

// Basın sayfası için API fonksiyonları
export const fetchMediaPartnersData = async () => {
  return await fetchData('api/panel/pages/basin');
}

export const updateMediaPartnersData = async (data: unknown) => {
  return await updateData('api/panel/pages/basin/update', data);
}

export const addMediaPartnersData = async (data: unknown) => {
  return await addData('api/panel/pages/basin/add', data);
}

export const deleteMediaPartnersData = async (id: number) => {
  return await deleteData('api/panel/pages/basin/delete', id);
}

// Yayın Akışı sayfası için API fonksiyonları
export const fetchYayinAkisiPageData = async () => {
  return await fetchData('api/panel/pages/yayin-akisi');
}

export const updateYayinAkisiPageData = async (data: unknown) => {
  return await updateData('api/panel/pages/yayin-akisi/update', data); 
}

export const addYayinAkisiPageData = async (data: unknown) => {
  return await addData('api/panel/pages/yayin-akisi/add', data);
}

export const deleteYayinAkisiPageData = async (id: number) => {
  return await deleteData('api/panel/pages/yayin-akisi/delete', id);
}

// Reklam sayfası için API fonksiyonları
export async function fetchAdvertisingData() {
  try {
    // Gerçek API çağrısı burada yapılacak
    return {
      introText: "TV42'de reklam vermek için aşağıdaki bilgileri inceleyebilirsiniz.",
      adOpportunities: [
        "Ana haber kuşağında reklam",
        "Program sponsorluğu",
        "Alt bant reklamları",
        "Özel tanıtım videoları"
      ],
      adBenefits: [
        "Geniş izleyici kitlesine erişim",
        "Bölgesel hedefleme imkanı",
        "Marka bilinirliğini artırma",
        "Farklı bütçelere uygun seçenekler"
      ],
      contactPhone: "+90 332 123 1212",
      contactEmail: "reklam@tv42.com.tr",
      contactNote: "Reklam departmanımız hafta içi 09:00-18:00 saatleri arasında hizmet vermektedir."
    };
  } catch (error) {
    console.error("Reklam verileri alınırken hata oluştu:", error);
    throw error;
  }
}

export async function updateAdvertisingData(data: unknown) {
  try {
    // Gerçek API çağrısı burada yapılacak
    console.log("Reklam verileri güncelleniyor:", data);
    
    // Başarılı güncelleme simülasyonu
    return { success: true };
  } catch (error) {
    console.error("Reklam verileri güncellenirken hata oluştu:", error);
    throw error;
  }
}

// Programlar sayfası için API fonksiyonları
export const fetchProgramsData = async () => {
 return await fetchData('api/panel/pages/programs'); 
}

export const fetchProgramData = async (id: string) => {
  return await fetchData('api/panel/pages/programs', id);
}

export const updateProgramsData = async (data: unknown) => {
  return await updateData('api/panel/pages/programs/update', data);
}

export const addProgramsData = async (data: unknown) => {
  return await addData('api/panel/pages/programs/add', data);
}

export const deleteProgramData = async (id: number) => {
  return await deleteData('api/panel/pages/programs/delete', id); 
}

// Social Media
export const updateSocialMediaData = async (data: unknown) => {
  return await updateData('api/panel/socialmedia/update', data);
};

// Settings
export const fetchSiteSettingsData = async () => {
  return await fetchData('api/panel/settings/site');
};

export const updateSiteSettingsData = async (data: unknown) => {
  return await updateData('api/panel/settings/site/update', data);
};

export const updatePassword = async (data: unknown) => {
  return await updateData('api/panel/settings/user/password/update', data);
};

// Home Pages
export const fetchHomePageData = async () => {
  return await fetchData('api/panel/pages/home');
};

export const updateHomePageData = async (data: unknown) => {
  return await updateData('api/panel/pages/home/update', data);
};

export const deleteHomePageDataTrailer = async (id: number) => {
  return await deleteData('api/panel/pages/home/trailer/delete', id);
};

export const deleteHomePageDataEpisode = async (id: number) => {
  return await deleteData('api/panel/pages/home/episode/delete', id);
};

// Contact Pages
export const fetchContactPageData = async () => {
  return await fetchData('api/panel/pages/contact');
};

export const updateContactPageData = async (data: unknown) => {
  return await updateData('api/panel/pages/contact/update', data);
};

//Users

export const fetchUsersPageData = async () => {
  return await fetchData('api/panel/users/list');
};

export const addUser = async (data: unknown) => {
  return await addData('api/panel/users/list/add', data);
};

export const updateUser = async (data: unknown) => {
  return await updateData('api/panel/users/list/update', data);
};

export const deleteUser = async (id: number) => {
  return await deleteData('api/panel/users/list/delete', id);
};

export const fetchUsersGroupsPageData = async () => {
  return await fetchData('api/panel/users/groups');
};

export const addUsersGroups = async (data: unknown) => {
  return await addData('api/panel/users/groups/add', data);
};

export const updateUsersGroups = async (data: unknown) => {
  return await updateData('api/panel/users/groups/update', data);
};

export const updateGroupPermissions = async (data: unknown) => {
  return await updateData('api/panel/users/groups/permissions/update', data);
};

// Dashboard
export const fetchDashboardData = async () => {
  return await fetchData('api/panel/dashboard');
};
