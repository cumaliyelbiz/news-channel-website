const db = require('../../config/db');
const bcrypt = require('bcrypt'); // bcrypt kütüphanesini dahil ediyoruz

exports.getProgramsPages = async (req, res) => {
    db.query(`
        SELECT * FROM programs
    `, (err, programResults) => {
        if (err) {
            return res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
        }
        res.json({ programs: programResults });
    });
};

exports.updateProgramPage = async (req, res) => {    
    try {
        // Check if the data is coming as an array of programs
        const programsArray = req.body.programs || [req.body];
        
        // Track successful updates
        let successCount = 0;
        let errorCount = 0;
        
        // Process each program in the array
        for (const programData of programsArray) {
            const { 
                id, 
                title,           // Program başlığı
                subtitle,        // Program alt başlığı
                description,     // Program açıklaması
                presenter,       // Program sunucusu
                broadcast_day,   // Yayın günü
                broadcast_time,  // Yayın saati
                image,           // Program görseli
                category,        // Program kategorisi
                is_active        // Program aktif mi?
            } = programData;
            
            // Skip items without ID
            if (!id) {
                errorCount++;
                continue;
            }

            const query = `
                UPDATE programs
                SET title = ?, 
                    subtitle = ?, 
                    description = ?, 
                    presenter = ?, 
                    broadcast_day = ?, 
                    broadcast_time = ?, 
                    image = ?, 
                    category = ?, 
                    is_active = ?,
                    updated_at = NOW()
                WHERE id = ?
            `;

            try {
                // Use promise-based query for better async handling
                await db.promise().query(query, [
                    title, 
                    subtitle, 
                    description, 
                    presenter, 
                    broadcast_day, 
                    broadcast_time, 
                    image, 
                    category, 
                    is_active, 
                    id
                ]);
                
                successCount++;
            } catch (err) {
                console.error(`Veritabanı hatası (Program ID: ${id}):`, err);
                errorCount++;
            }
        }
        
        // Return appropriate response based on results
        if (errorCount === 0) {
            res.json({ 
                message: `${successCount} program başarıyla güncellendi`, 
                success: true 
            });
        } else if (successCount > 0) {
            res.json({ 
                message: `${successCount} program güncellendi, ${errorCount} program güncellenemedi`, 
                success: true,
                partialFailure: true
            });
        } else {
            return res.status(500).json({ 
                message: 'Hiçbir program güncellenemedi', 
                success: false 
            });
        }
    } catch (err) {
        console.error('Genel hata:', err);
        return res.status(500).json({ 
            message: 'İşlem sırasında hata oluştu', 
            error: err.message 
        });
    }
};

exports.addProgramPage = async (req, res) => {    
    // Check if the data is coming in the programs array
    const programData = req.body.programs ? req.body.programs[0] : req.body;
    
    const {
        title,           // Program başlığı
        subtitle,        // Program alt başlığı
        description,     // Program açıklaması
        presenter,       // Program sunucusu 
        broadcast_day,   // Yayın günü
        broadcast_time,  // Yayın saati
        image,           // Program görseli
        category,        // Program kategorisi
        is_active        // Program aktif mi?
    } = programData;

    // Validate required fields
    if (!title) {
        return res.status(400).json({ 
            message: 'Program başlığı gereklidir', 
            success: false 
        });
    }

    // Set default values for optional fields
    const dataToInsert = {
        title,
        subtitle: subtitle || '',
        description: description || '',
        presenter: presenter || '',
        broadcast_day: broadcast_day || '',
        broadcast_time: broadcast_time || '',
        image: image || '',
        category: category || '',
        is_active: is_active !== undefined ? is_active : 1  // Default to active if not specified
    };

    const query = `
        INSERT INTO programs (
            title,
            subtitle,
            description,
            presenter,
            broadcast_day,
            broadcast_time,
            image,
            category,
            is_active
        ) 
        VALUES (?,?,?,?,?,?,?,?,?)
    `;

    try {
        // Use db.promise().query() to get a Promise-based interface
        const [result] = await db.promise().query(query, [
            dataToInsert.title,
            dataToInsert.subtitle,
            dataToInsert.description,
            dataToInsert.presenter,
            dataToInsert.broadcast_day,
            dataToInsert.broadcast_time,
            dataToInsert.image,
            dataToInsert.category,
            dataToInsert.is_active  
        ]);
        
        res.json({ message: 'Program başarıyla eklendi', success: true }); 
    } catch (err) {
        console.error('Veritabanı hatası:', err);
        res.status(500).json({ message: 'Veritabanı hatası', error: err.message }); 
    }
}

exports.deleteProgramPage = async (req, res) => {
    const { id } = req.params;

    const query = `
        DELETE FROM programs
        WHERE id =?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
        }
        res.json({ message: 'Program başarıyla silindi', success: true });   
    }) 
}

exports.getProgramById = async (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT * FROM programs
        WHERE id =?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err); 
        }  
        res.json({ program: results[0] });
    }) 
}

exports.getYayinAkisiPages = async (req, res) => {
    db.query(`
        SELECT * FROM yayin_akisi ORDER BY day_of_week, broadcast_time
    `, (err, yayinAkisiResults) => {
        if (err) {
            return res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
        }
        
        // Günlere göre gruplandırma
        const groupedByDay = {
            'Pazartesi': [],
            'Salı': [],
            'Çarşamba': [],
            'Perşembe': [],
            'Cuma': [],
            'Cumartesi': [],
            'Pazar': []
        };
        
        // Her bir yayın akışı öğesini günlere göre gruplandır ve formatla
        yayinAkisiResults.forEach(item => {
            if (groupedByDay[item.day_of_week] !== undefined) {
                groupedByDay[item.day_of_week].push({
                    id: item.id,
                    time: item.broadcast_time.substring(0, 5), // "00:00:00" -> "00:00"
                    program: item.program_name
                });
            }
        });
        
        // Boş günler için varsayılan değer ekle
        Object.keys(groupedByDay).forEach(day => {
            if (groupedByDay[day].length === 0) {
                groupedByDay[day] = [{ id: 1, time: "", program: "" }];
            }
        });
        
        // İstenilen formatta yanıt döndür
        res.json({ 
            scheduleItems: groupedByDay 
        }); 
    });
};

exports.updateYayinAkisiPage = async (req, res) => {
    const { scheduleItems } = req.body;
    
    try {
        // For each day in the schedule
        for (const day in scheduleItems) {
            const programs = scheduleItems[day];
            //console.log(`Processing day: ${day} with ${programs.length} programs`);
            
            // Get existing records for this day
            const [existingRecords] = await db.promise().query(
                'SELECT id, program_name, broadcast_time FROM yayin_akisi WHERE day_of_week = ?', 
                [day]
            );
            
            //console.log(`Found ${existingRecords.length} existing records for ${day}`);
            
            // Create a set of existing IDs for quick lookup
            const existingIds = new Set(existingRecords.map(record => record.id));
            
            // Track IDs that are processed to identify which ones to delete later
            const processedIds = new Set();
            
            // Process each program in the day
            for (const program of programs) {
                // Skip empty entries (both time and program are empty)
                if ((!program.time || program.time.trim() === '') && 
                    (!program.program || program.program.trim() === '')) {
                    //console.log(`Skipping empty program entry for ${day}`);
                    continue;
                }
                
                // Validate time format (HH:MM)
                const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                const isValidTime = program.time && timeRegex.test(program.time);
                
                // Skip entries with invalid time but log them
                if (program.time && !isValidTime) {
                    console.log(`Invalid time format: ${program.time} for program: ${program.program}`);
                    continue;
                }
                
                // If program has a valid ID and exists in the database
                if (program.id && program.id > 0 && existingIds.has(program.id)) {
                    // Update the existing record
                    try {
                        await db.promise().query(
                            `UPDATE yayin_akisi 
                             SET broadcast_time = ?, program_name = ? 
                             WHERE id = ?`,
                            [
                                isValidTime ? program.time + ':00' : '00:00:00',
                                program.program || '',
                                program.id
                            ]
                        );
                        
                        // Mark this ID as processed
                        processedIds.add(program.id);
                        //console.log(`Updated program ID ${program.id}: ${program.program} at ${program.time}`);
                    } catch (updateErr) {
                        console.error(`Error updating program ID ${program.id}:`, updateErr);
                    }
                } 
                // If it's a new entry with valid data
                else if (program.program && isValidTime) {
                    // Insert a new record
                    try {
                        const [insertResult] = await db.promise().query(
                            `INSERT INTO yayin_akisi (day_of_week, broadcast_time, program_name) 
                             VALUES (?, ?, ?)`,
                            [
                                day,
                                program.time + ':00',
                                program.program
                            ]
                        );
                        
                        if (insertResult && insertResult.insertId) {
                            //console.log(`Inserted new program: ${program.program} at ${program.time} for ${day} with ID ${insertResult.insertId}`);
                            // Add the new ID to processed IDs
                            processedIds.add(insertResult.insertId);
                        } else {
                            console.error(`Failed to insert program: ${program.program} at ${program.time} for ${day}. Insert result:`, insertResult);
                        }
                    } catch (insertErr) {
                        console.error(`Error inserting new program ${program.program}:`, insertErr);
                    }
                }
            }
            
            // Delete records for this day that weren't in the update
            // Only if we have valid programs for this day (to avoid deleting everything)
            if (programs.some(p => p.program && p.time)) {
                try {
                    const idsToKeep = Array.from(processedIds);
                    
                    // If we have IDs to keep, use them in the query
                    if (idsToKeep.length > 0) {
                        const placeholders = idsToKeep.map(() => '?').join(',');
                        await db.promise().query(
                            `DELETE FROM yayin_akisi 
                             WHERE day_of_week = ? AND id NOT IN (${placeholders})`,
                            [day, ...idsToKeep]
                        );
                    } else {
                        // If no IDs to keep, delete all for this day
                        await db.promise().query(
                            'DELETE FROM yayin_akisi WHERE day_of_week = ?',
                            [day]
                        );
                    }
                    //console.log(`Cleaned up old records for ${day}`);
                } catch (deleteErr) {
                    console.error(`Error cleaning up old records for ${day}:`, deleteErr);
                }
            }
        }
        
        res.json({ 
            message: 'Yayın akışı başarıyla güncellendi', 
            success: true 
        });
    } 
    catch (err) {
        console.error('Güncelleme hatası:', err);
        return res.status(500).json({ 
            message: 'Veritabanı hatası', 
            error: err.message 
        }); 
    }
};


exports.getCanliYayinPages = async (req, res) => {
    db.query(`
        SELECT * FROM canli_yayin WHERE id = 1
    `, (err, canliYayinResults) => {
        if (err) {
            return res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
        }

        res.json(canliYayinResults[0]);
    } 
);
};

exports.updateCanliYayinPage = async (req, res) => {
    const {
        streamUrl,
        streamTitle,
        thumbnailUrl,
        isLive
    } = req.body; 
    const query = `
        UPDATE canli_yayin
        SET streamUrl =?, streamTitle =?, thumbnailUrl =?, isLive =?
        WHERE id = 1
    `;

    db.query(query, [streamUrl, streamTitle, thumbnailUrl, isLive], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
        }   
        res.json({ message: 'Başarıyla güncellendi', success: true });
    })
}


exports.addBasinPage = async (req, res) => {
    const { name, url, image } = req.body;

    const query = `
        INSERT INTO partners (name, url, image)
        VALUES (?, ?, ?)
    `;

    db.query(query, [name, url, image], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
        }   
        res.json({ message: 'Başarıyla eklendi', success: true });
    })
}

exports.deleteBasinPage = async (req, res) => {
    const { id } = req.params;

    const query = `
        DELETE FROM partners
        WHERE id =? 
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
        }   
        res.json({ message: 'Başarıyla silindi', success: true });
    })
}

exports.updateBasinPage = async (req, res) => {
    const { mediaPartners } = req.body;

    try {
        // Process each media partner update sequentially
        for (const item of mediaPartners) {
            const updateQuery = `
                UPDATE partners 
                SET name = ?, url = ?, image = ?
                WHERE id = ?
            `;

            await new Promise((resolve, reject) => {
                db.query(updateQuery, [item.name, item.url, item.image, item.id], (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
            });
        }

        res.json({ message: 'Başarıyla güncellendi', success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Veritabanı hatası', error: err.message }); 
    }
}
exports.getBasinPages = async (req, res) => {
    db.query(`
        SELECT * FROM partners
    `, (err, partnerResults) => {
        if (err) {
            return res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
        }
        res.json({ mediaPartners: partnerResults });
    });
};


exports.getKunyePages = async (req, res) => {
    db.query(`
        SELECT * FROM kunye WHERE id = 1
    `, (err, kunyeResults) => {
        if (err) {
            return res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
        }
        
        // Tek bir kayıt olduğu için ilk kaydı dönüyoruz
        const kunye = kunyeResults[0] || {
            unvan: "",
            logo: "",
            yayin_ortami: "",
            lisans_tipi: "",
            yayin_turu: "",
            adres: "",
            telefon_faks: "",
            internet_adresi: "",
            email: "",
            kep_adresi: "",
            vergi_daire_no: "",
            mersis_no: "",
            sorumlular: [],
            izleyici_temsilcisi_ad: "",
            izleyici_temsilcisi_email: "",
            dokumanlar: []
        };
        
        // JSON alanlarını parse ediyoruz
        if (typeof kunye.sorumlular === 'string') {
            try {
                kunye.sorumlular = JSON.parse(kunye.sorumlular);
            } catch (e) {
                kunye.sorumlular = [];
            }
        } else if (!kunye.sorumlular) {
            kunye.sorumlular = [];
        }
        
        if (typeof kunye.dokumanlar === 'string') {
            try {
                kunye.dokumanlar = JSON.parse(kunye.dokumanlar);
            } catch (e) {
                kunye.dokumanlar = [];
            }
        } else if (!kunye.dokumanlar) {
            kunye.dokumanlar = [];
        }
        
        res.json(kunye);
    }); 
};

exports.updateKunyePage = async (req, res) => {
    const {
        unvan, logo, yayin_ortami, lisans_tipi, yayin_turu, adres,
        telefon_faks, internet_adresi, email, kep_adresi, vergi_daire_no, mersis_no,
        sorumlular, izleyici_temsilcisi_ad, izleyici_temsilcisi_email, dokumanlar
    } = req.body;
    
    // JSON alanlarını string'e çeviriyoruz
    const sorumlularJSON = JSON.stringify(sorumlular || []);
    const dokumanlarJSON = JSON.stringify(dokumanlar || []);
    
    // Önce kayıt var mı kontrol et
    db.query('SELECT id FROM kunye LIMIT 1', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
        }
        
        if (results.length > 0) {
            // Kayıt varsa güncelle
            const id = results[0].id;
            db.query(`
                UPDATE kunye SET
                    unvan = ?,
                    logo = ?,
                    yayin_ortami = ?,
                    lisans_tipi = ?,
                    yayin_turu = ?,
                    adres = ?,
                    telefon_faks = ?,
                    internet_adresi = ?,
                    email = ?,
                    kep_adresi = ?,
                    vergi_daire_no = ?,
                    mersis_no = ?,
                    sorumlular = ?,
                    izleyici_temsilcisi_ad = ?,
                    izleyici_temsilcisi_email = ?,
                    dokumanlar = ?
                WHERE id = ?
            `, [
                unvan, logo, yayin_ortami, lisans_tipi, yayin_turu, adres,
                telefon_faks, internet_adresi, email, kep_adresi, vergi_daire_no, mersis_no,
                sorumlularJSON, izleyici_temsilcisi_ad, izleyici_temsilcisi_email, dokumanlarJSON,
                id
            ], (updateErr) => {
                if (updateErr) {
                    return res.status(500).json({ message: 'Güncelleme hatası', error: updateErr.message });
                }
                
                res.json({ message: 'Künye başarıyla güncellendi', success: true });
            });
        } else {
            // Kayıt yoksa ekle
            db.query(`
                INSERT INTO kunye (
                    unvan, logo, yayin_ortami, lisans_tipi, yayin_turu, adres,
                    telefon_faks, internet_adresi, email, kep_adresi, vergi_daire_no, mersis_no,
                    sorumlular, izleyici_temsilcisi_ad, izleyici_temsilcisi_email, dokumanlar
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                unvan, logo, yayin_ortami, lisans_tipi, yayin_turu, adres,
                telefon_faks, internet_adresi, email, kep_adresi, vergi_daire_no, mersis_no,
                sorumlularJSON, izleyici_temsilcisi_ad, izleyici_temsilcisi_email, dokumanlarJSON
            ], (insertErr) => {
                if (insertErr) {
                    return res.status(500).json({ message: 'Ekleme hatası', error: insertErr.message });
                }
                
                res.json({ message: 'Künye başarıyla oluşturuldu', success: true });
            });
        }
    });
};



exports.getDashboard = async (req, res) => {
    try {
        // Parallel queries for better performance
        const [allProgramsCount] = await db.promise().query('SELECT COUNT(*) as count FROM programs');
        const [activeProgramsCount] = await db.promise().query('SELECT COUNT(*) as count FROM programs WHERE is_active = 1');
        const [fragmanlarCount] = await db.promise().query('SELECT COUNT(*) as count FROM fragmanlar WHERE is_active = 1');
        const [bolumlerCount] = await db.promise().query('SELECT COUNT(*) as count FROM bolumler WHERE is_active = 1');
        const [usersCount] = await db.promise().query('SELECT COUNT(*) as count FROM users');
        const [partnersCount] = await db.promise().query('SELECT COUNT(*) as count FROM partners');
        
        // Get live broadcast status
        const [canliYayin] = await db.promise().query('SELECT isLive FROM canli_yayin WHERE id = 1');
        
        // Prepare dashboard data
        const dashboardData = {
            counts: {
                allPrograms: allProgramsCount[0].count,
                activePrograms: activeProgramsCount[0].count,
                fragmanlar: fragmanlarCount[0].count,
                bolumler: bolumlerCount[0].count,
                users: usersCount[0].count,
                partners: partnersCount[0].count,
                isLive: canliYayin[0]?.isLive || 0
            },
        };
        
        res.json(dashboardData);
    } catch (err) {
        console.error('Dashboard veri hatası:', err);
        return res.status(500).json({ 
            message: 'Veritabanı hatası', 
            error: err.message 
        });
    }
};


exports.updatePassword = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    // Kullanıcının ID'sini almak için token veya başka bir yöntemle elde etmelisiniz
    // Kullanıcının mevcut şifresini veritabanından alıyoruz
    db.query('SELECT password FROM users WHERE id = ?', [userId], async (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
        }

        // Kullanıcı bulunamazsa
        if (results.length === 0) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        const hashedPassword = results[0].password;

        // Eski şifreyi kontrol et
        const isMatch = await bcrypt.compare(oldPassword, hashedPassword);
        if (!isMatch) {
            return res.status(400).json({ message: { title: 'Hata', description: 'Eski şifre yanlış.' } });
        }

        // Yeni şifreyi hash'le
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        // Yeni şifreyi veritabanına güncelle
        db.query('UPDATE users SET password = ? WHERE id = ?', [newHashedPassword, userId], (err, results) => {
            if (err) {
                console.error('Veritabanı hatası:', err);
                return res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
            }

            res.json({ message: { title: 'Başarılı', description: 'Şifre başarıyla güncellendi.' } });
        });
    });
};

exports.updateSiteSettingsData = async (req, res) => {
    const { name, description } = req.body;
    const query = ` UPDATE contact SET name = ?, description = ? `;
    db.query(query, [name, description], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({
                message: { title: 'Hata', description: 'Veritabanı hatası oluştu.' },
            });
        }

        // Başarılı bir şekilde kullanıcı ekledikten sonra yanıt dönüyoruz
        res.json({
            message: { title: 'Başarılı', description: 'Site ayarları başarıyla düzenlendi.' },
        });
    });
};

exports.updateSocialMedia = async (req, res) => {
    const { facebook, instagram, twitter, linkedin, youtube } = req.body;
    const query = ` UPDATE social_media SET facebook=?, instagram=?, twitter=?, linkedin=?, youtube=? `;
    db.query(query, [facebook, instagram, twitter, linkedin, youtube], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({
                message: { title: 'Hata', description: 'Veritabanı hatası oluştu.' },
            });
        }

        // Başarılı bir şekilde kullanıcı ekledikten sonra yanıt dönüyoruz
        res.json({
            message: { title: 'Başarılı', description: 'Sosyal medya bilgileri başarıyla düzenlendi.' },
        });
    });
};

exports.getSiteSettingsData = async (req, res) => {
    db.query('SELECT * FROM contact', (err, contactResults) => {
        if (err) {
            return res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
        }
        db.query('SELECT * FROM social_media', (err, socialmediaResults) => {
            if (err) {
                return res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
            }
            res.json({ contact: contactResults[0], socialmedia: socialmediaResults[0] });
        });
    });
};


exports.getHomePages = async (req, res) => {
    try {
        // Fragmanları çek
        const fragmanQuery = `
            SELECT id, title, image, time, day
            FROM fragmanlar 
            WHERE is_active = 1 
            ORDER BY created_at DESC
        `;
        
        // Bölümleri çek
        const bolumlerQuery = `
            SELECT id, title, image
            FROM bolumler 
            WHERE is_active = 1 
            ORDER BY created_at DESC
        `;
        
        // Her iki sorguyu da Promise olarak çalıştır
        const [fragmanResults] = await db.promise().query(fragmanQuery);
        const [bolumlerResults] = await db.promise().query(bolumlerQuery);
        
        // Sonuçları birleştir ve yanıt olarak gönder
        res.json({
            fragmanlar: fragmanResults,
            bolumler: bolumlerResults
        });
    } catch (err) {
        console.error('Veritabanı hatası:', err);
        return res.status(500).json({ 
            message: 'Veritabanı hatası', 
            error: err.message 
        });
    }
};

exports.updateHomePage = async (req, res) => {
    try {
        const { fragmanlar, bolumler } = req.body;
        
        // Update fragmanlar if provided
        if (fragmanlar && Array.isArray(fragmanlar)) {
            for (const fragman of fragmanlar) {
                if (fragman.id) {
                    // Update existing fragman
                    const updateQuery = `
                        UPDATE fragmanlar 
                        SET title = ?, image = ?, time = ?, day = ?, is_active = ? 
                        WHERE id = ?
                    `;
                    await db.promise().query(updateQuery, [
                        fragman.title,
                        fragman.image,
                        fragman.time,
                        fragman.day,
                        fragman.is_active !== undefined ? fragman.is_active : 1,
                        fragman.id
                    ]);
                } else {
                    // Insert new fragman
                    const insertQuery = `
                        INSERT INTO fragmanlar (title, image, time, day, is_active)
                        VALUES (?, ?, ?, ?, ?)
                    `;
                    await db.promise().query(insertQuery, [
                        fragman.title,
                        fragman.image,
                        fragman.time,
                        fragman.day,
                        fragman.is_active !== undefined ? fragman.is_active : 1
                    ]);
                }
            }
        }
        
        // Update bolumler if provided
        if (bolumler && Array.isArray(bolumler)) {
            for (const bolum of bolumler) {
                if (bolum.id) {
                    // Update existing bolum
                    const updateQuery = `
                        UPDATE bolumler 
                        SET title = ?, image = ?, is_active = ? 
                        WHERE id = ?
                    `;
                    await db.promise().query(updateQuery, [
                        bolum.title,
                        bolum.image,
                        bolum.is_active !== undefined ? bolum.is_active : 1,
                        bolum.id
                    ]);
                } else {
                    // Insert new bolum
                    const insertQuery = `
                        INSERT INTO bolumler (title, image, is_active)
                        VALUES (?, ?, ?)
                    `;
                    await db.promise().query(insertQuery, [
                        bolum.title,
                        bolum.image,
                        bolum.is_active !== undefined ? bolum.is_active : 1
                    ]);
                }
            }
        }
        
        res.json({ 
            message: { 
                title: 'Başarılı', 
                description: 'Anasayfa verileri başarıyla güncellendi' 
            } 
        });
    } catch (err) {
        console.error('Veritabanı hatası:', err);
        return res.status(500).json({ 
            message: { 
                title: 'Hata', 
                description: 'Veritabanı hatası oluştu' 
            }, 
            error: err.message 
        });
    }
};

exports.deleteTrailer = async (req, res) => {
    const trailerId = req.params.id;

    // Fragmanı veritabanından sil
    const deleteQuery = 'DELETE FROM fragmanlar WHERE id = ?';
    db.query(deleteQuery, [trailerId], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({
                message: { title: 'Hata', description: 'Veritabanı hatası oluştu.' },  
            }) 
        } 
        // Başarılı bir şekilde kullanıcı ekledikten sonra yanıt dönüyoruz
        res.json({
            message: { title: 'Başarılı', description: 'Fragman başarıyla silindi.' },
        });
    }) 
}

exports.deleteEpisode = async (req, res) => {
    const episodeId = req.params.id;

    // Bölümü veritabanından sil
    const deleteQuery = 'DELETE FROM bolumler WHERE id =?'; 
    db.query(deleteQuery, [episodeId], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({
                message: { title: 'Hata', description: 'Veritabanı hatası oluştu.' },
            })
        } 
        // Başarılı bir şekilde kullanıcı ekledikten sonra yanıt dönüyoruz
        res.json({
            message: { title: 'Başarılı', description: 'Bölüm başarıyla silindi.' },
        });
    })
}


exports.getContactPages = async (req, res) => {
    db.query('SELECT * FROM contact', (err, contactResults) => {
        if (err) {
            return res.status(500).json({ message: 'Veritabanı hatası' });
        }
        db.query('SELECT * FROM social_media', (err, socialmediaResults) => {
            if (err) {
                return res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
            }
            res.json({ contact: contactResults[0], socialmedia: socialmediaResults[0] });
        });
    });
};

exports.updateContactPage = async (req, res) => {
    const { address, phone, fax, email, maps } = req.body;

    // İletişim bilgilerini güncelleme
    const updateQuery = 'UPDATE contact SET address = ?, phone = ?, faxs = ?, email = ?, maps = ?';
    db.query(updateQuery, [address, JSON.stringify(phone), JSON.stringify(fax), JSON.stringify(email), maps], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Veritabanı hatası' });
        }
        // Başarılı işlem mesajı
        res.json({ message: { title: 'Başarılı', description: 'İletişim sayfası verileri başarıyla güncellendi' } });
    });
};


exports.getUsersPages = async (req, res) => {
    db.query(`
        SELECT 
            u.id,
            u.name,
            u.email,
            ug.id AS groupId,     -- Grup ID'si
            ug.name AS groupName, -- Grup adı
            u.status
        FROM 
            users u
        LEFT JOIN 
            users_groups ug ON u.group_id = ug.id
        GROUP BY 
            u.id, ug.id
    `, (err, usersResults) => {
        if (err) {
            return res.status(500).json({ message: 'Veritabanı hatası' });
        }

        // Grupları ayrı bir sorgu ile çekmek isteyebilirsiniz
        db.query(`SELECT id, name FROM users_groups`, (err, groupsResults) => {
            if (err) {
                return res.status(500).json({ message: 'Gruplar çekilirken hata oluştu' });
            }

            res.json({
                users: usersResults,   // Kullanıcılar
                groups: groupsResults  // Tüm gruplar
            });
        });
    });
};

exports.addUsers = async (req, res) => {
    const { name, email, password, groupId, status } = req.body;

    // Verilerin doğru formatta olduğundan emin olalım
    if (!name || !email || !password || !groupId || !status) {
        return res.status(400).json({
            message: { title: 'Hata', description: 'Tüm alanlar doldurulmalıdır.' },
        });
    }

    // Şifreyi hash'lemek için bcrypt kullanıyoruz
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // 10 salt değeriyle şifreyi hash'liyoruz

        // Veritabanına yeni kullanıcıyı eklemek için SQL sorgusunu yazıyoruz
        const query = `
            INSERT INTO users (name, email, password, group_id, status)
            VALUES (?, ?, ?, ?, ?)
        `;

        // Veritabanı sorgusunu çalıştırıyoruz
        db.query(query, [name, email, hashedPassword, groupId, status], (err, results) => {
            if (err) {
                console.error('Veritabanı hatası:', err);
                return res.status(500).json({
                    message: { title: 'Hata', description: 'Veritabanı hatası oluştu.' },
                });
            }

            // Başarılı bir şekilde kullanıcı ekledikten sonra yanıt dönüyoruz
            res.json({
                message: { title: 'Başarılı', description: 'Kullanıcı başarıyla oluşturuldu.' },
            });
        });

    } catch (err) {
        console.error('Şifre hashleme hatası:', err);
        return res.status(500).json({
            message: { title: 'Hata', description: 'Şifre hashleme işlemi sırasında hata oluştu.' },
        });
    }
};


exports.updateUsers = async (req, res) => {
    const { id, name, email, groupId, status } = req.body;
    const query = `
    UPDATE users SET name=?, email=?, group_id=?, status=? WHERE id=?
    `;
    db.query(query, [name, email, groupId, status, id], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({
                message: { title: 'Hata', description: 'Veritabanı hatası oluştu.' },
            });
        }

        // Başarılı bir şekilde kullanıcı ekledikten sonra yanıt dönüyoruz
        res.json({
            message: { title: 'Başarılı', description: 'Kullanıcı bilgileri başarıyla düzenlendi.' },
        });
    });
};


exports.deleteUsers = async (req, res) => {
    const userId = req.params.id;  // URL parametresinden id'yi alıyoruz

    // Veritabanından kullanıcıyı silmek için SQL sorgusu
    const query = 'DELETE FROM users WHERE id = ?';

    // Kullanıcıyı silme işlemi
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Silme işlemi sırasında hata:', err);
            return res.status(500).json({ message: 'Veritabanı hatası' });
        }

        // Eğer kullanıcı bulunmuşsa ve silme işlemi başarılıysa
        if (results.affectedRows > 0) {
            res.json({
                message: { title: 'Başarılı', description: 'Kullanıcı başarıyla silindi.' },
            });
        } else {
            return res.status(404).json({ message: { title: 'Başarılı', description: 'Kullanıcı bulunamadı.' }, });
        }
    });
};


exports.getUsersGroupsPages = async (req, res) => {
    try {
        // 1. Grup bilgilerini al
        const groupsQuery = `
            SELECT 
                g.id,
                g.name,
                g.description,
                COUNT(u.group_id) AS membersCount
            FROM 
                users_groups g
            LEFT JOIN 
                users u ON g.id = u.group_id
            GROUP BY 
                g.id
        `;

        const [groupsResults] = await db.promise().query(groupsQuery);

        // 2. İzinleri al
        const permissionsQuery = `
            SELECT 
                id,
                name,
                value,
                description,
                category
            FROM 
                permissions
        `;

        const [permissionsResults] = await db.promise().query(permissionsQuery);

        // 3. Her grubun izinlerini al
        const groupPermissionsQuery = `
            SELECT 
    g.id AS group_id,
    CONCAT('[', GROUP_CONCAT(
        CONCAT(
            '{"id":', p.id, 
            ',"name":"', p.name, '"',
            ',"value":"', p.value, '"',
            ',"description":"', IFNULL(p.description, ''), '"',
            ',"category":"', IFNULL(p.category, '') , '"}'
        )
    ), ']') AS permissions
FROM 
    group_permissions gp
LEFT JOIN 
    permissions p ON gp.permission_id = p.id
LEFT JOIN 
    users_groups g ON gp.group_id = g.id
GROUP BY 
    g.id;

        `;

        const [groupPermissionsResults] = await db.promise().query(groupPermissionsQuery);

        // 4. Her grubun izinlerini ilgili gruba ekle
        const groupsWithPermissions = groupsResults.map(group => {
            const groupPermissions = groupPermissionsResults.find(gp => gp.group_id === group.id);
            return {
                ...group,
                permissions: groupPermissions ? groupPermissions.permissions : [] // İzinler JSON dizisi
            };
        });

        // Yanıt olarak hem grupları hem de izinleri gönder
        res.json({
            groups: groupsWithPermissions,
            permissions: permissionsResults // Tüm izinleri de gönderebiliriz
        });

    } catch (err) {
        console.error('Veritabanı hatası:', err); // Hata detaylarını kontrol et
        res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
    }
};



exports.addUsersGroups = async (req, res) => {
    const { name, description } = req.body;

    // Verilerin doğru formatta olduğundan emin olalım
    if (!name || !description) {
        return res.status(400).json({
            message: { title: 'Hata', description: 'Tüm alanlar doldurulmalıdır.' },
        });
    }

    // Veritabanına yeni kullanıcıyı eklemek için SQL sorgusunu yazıyoruz
    const query = `
      INSERT INTO users_groups (name, description) 
      VALUES (?, ?)
    `;

    // Veritabanı sorgusunu çalıştırıyoruz
    db.query(query, [name, description], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({
                message: { title: 'Hata', description: 'Veritabanı hatası oluştu.' },
            });
        }

        // Başarılı bir şekilde kullanıcı ekledikten sonra yanıt dönüyoruz
        res.json({
            message: { title: 'Başarılı', description: name + ' kullanıcı grubu başarıyla oluşturuldu.' },
        });
    });
};

exports.updateUsersGroups = async (req, res) => {
    const { id, name, description } = req.body;

    db.query('UPDATE users_groups SET name=?, description=? WHERE id=?', [name, description, id], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({
                message: { title: 'Hata', description: 'Veritabanı hatası oluştu.' },
            });
        }
        res.json({ message: { title: 'Başarılı', description: name + ' kullanıcı grubu başarıyla düzenlendi.' } });
    });
};


exports.updateGroupPermissions = async (req, res) => {
    const { groupId, permissions } = req.body;  // groupId ve permissions verilerini alıyoruz

    // groupId veya permissions yoksa hata döndürüyoruz
    if (!groupId || !permissions || !Array.isArray(permissions)) {
        return res.status(400).json({
            message: { title: 'Hata', description: 'Geçersiz veri, lütfen groupId ve geçerli bir permissions dizisi gönderin.' }
        });
    }

    try {
        // Öncelikle, mevcut izinleri silmeliyiz
        const deleteQuery = 'DELETE FROM group_permissions WHERE group_id = ?';
        const deleteParams = [groupId];

        // Önceki izinleri siliyoruz
        await new Promise((resolve, reject) => {
            db.query(deleteQuery, deleteParams, (err, results) => {
                if (err) {
                    console.error('Veritabanı hatası (silme):', err);
                    reject(new Error('Veritabanı hatası'));
                }
                resolve(results);
            });
        });

        // Yeni izinler için ekleme sorgusu oluşturuyoruz
        const permissionInserts = permissions.map(permission => {
            return new Promise((resolve, reject) => {
                const permissionId = permission.id;  // izin ID'si

                // Yeni izinleri ekliyoruz
                const insertQuery = `
                    INSERT INTO group_permissions (group_id, permission_id) 
                    VALUES (?, ?);
                `;
                const params = [groupId, permissionId];

                // Veritabanı sorgusunu çalıştırıyoruz
                db.query(insertQuery, params, (err, results) => {
                    if (err) {
                        console.error('Veritabanı hatası (ekleme):', err);
                        reject(new Error('Veritabanı hatası'));
                    }
                    resolve(results);
                });
            });
        });

        // Veritabanındaki tüm izinleri eklerken hata durumlarını bekliyoruz
        await Promise.all(permissionInserts);

        res.json({
            message: { title: 'Başarılı', description: 'Grup izinleri başarıyla güncellendi.' }
        });
    } catch (error) {
        console.error('Hata:', error);
        return res.status(500).json({
            message: { title: 'Hata', description: 'İzinler güncellenirken bir hata oluştu.' },
        });
    }
};

