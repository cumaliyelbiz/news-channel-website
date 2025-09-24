import React from 'react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useRouter } from "next/navigation";

const ContextMenuComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
                <ContextMenuItem inset onClick={() => router.back()}>
                    Geri
                    <ContextMenuShortcut>Alt + ←</ContextMenuShortcut>  {/* Windows/Linux için geri kısayolu */}
                </ContextMenuItem>

                <ContextMenuItem inset onClick={() => window.location.reload()}>
                    Sayfayı Yenile
                    <ContextMenuShortcut>F5</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem inset onClick={() => router.push('/panel/dashboard')}>
                    Anasayfa
                </ContextMenuItem>
                <ContextMenuSeparator />
                {/* Sayfalar */}
                <ContextMenuSub>
                    <ContextMenuSubTrigger inset>Sayfalar</ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                        <ContextMenuItem onClick={() => router.push('/panel/pages/anasayfa')}>
                            Anasayfa
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => router.push('/panel/pages/yayin-akisi')}>
                            Yayın Akışı
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => router.push('/panel/pages/programlar')}>
                            Programlar
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => router.push('/panel/pages/basin')}>
                            Basın
                        </ContextMenuItem>
                        
                        <ContextMenuItem onClick={() => router.push('/panel/pages/kunye')}>
                            Künye
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => router.push('/panel/pages/iletisim')}>
                            İletişim
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => router.push('/panel/pages/canli-yayin')}>
                            Canlı Yayın
                        </ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>
                {/* Kullanıcılar */}
                <ContextMenuSub>
                    <ContextMenuSubTrigger inset>Kullanıcılar</ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                        <ContextMenuItem onClick={() => router.push('/panel/users/list')}>
                            Kullanıcı Listesi
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => router.push('/panel/users/group')}>
                            Kullanıcı Grupları
                        </ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>
                {/* Ayarlar */}
                <ContextMenuSub>
                    <ContextMenuSubTrigger inset>Ayarlar</ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                        <ContextMenuItem onClick={() => router.push('/panel/settings/site')}>
                            Site Ayarları
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => router.push('/panel/settings/user')}>
                            Kullanıcı Ayarları
                        </ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>
                {/* Sosyal Medya */}
                <ContextMenuSub>
                    <ContextMenuSubTrigger inset>Sosyal Medya</ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                        <ContextMenuItem onClick={() => router.push('/panel/socialmedia')}>
                            Sosyal Medya Ayarları
                        </ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>


            </ContextMenuContent>
        </ContextMenu>
    );
};

export default ContextMenuComponent;