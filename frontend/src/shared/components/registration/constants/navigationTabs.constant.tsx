import { Building2, ContactRound, List, MessageSquareText, UsersRound } from 'lucide-react';

import { NavigationTab } from '../types/navigationTab.type';

export const navigationTabs = [
    {
        icon: <Building2 size={ 25 }/>,
        label: "Empresas",
        path: "company",
    },
    {
        icon: <UsersRound size={ 25 }/>,
        label: "Usuários",
        path: "user",
    },
    {
        icon: <List size={ 25 }/>,
        label: "Listas",
        path: "list",
    },
    {
        icon: <ContactRound size={ 25 }/>,
        label: "Contatos",
        path: "contact",
    },
    {
        icon: <MessageSquareText size={ 25 }/>,
        label: "Templates",
        path: "template",
    },
] satisfies NavigationTab[];
