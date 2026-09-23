import { Building2, MessageSquare, NotepadText, PhoneCall, Users } from 'lucide-react';

import { NavigationTab } from '../types/navigationTab.type';

export const navigationTabs = [
    {
        icon: <Building2 size={ 25 }/>,
        label: "Empresas",
        path: "company",
    },
    {
        icon: <Users size={ 25 }/>,
        label: "Usuários",
        path: "user",
    },
    {
        icon: <NotepadText size={ 25 }/>,
        label: "Listas",
        path: "list",
    },
    {
        icon: <PhoneCall size={ 25 }/>,
        label: "Contatos",
        path: "contact",
    },
    {
        icon: <MessageSquare size={ 25 }/>,
        label: "Templates",
        path: "template",
    },
] satisfies NavigationTab[];
