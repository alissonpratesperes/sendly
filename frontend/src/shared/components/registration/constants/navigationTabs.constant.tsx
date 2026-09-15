import { Building2, Contact, ListCheck, MessageSquare, Users } from 'lucide-react';

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
        icon: <ListCheck size={ 25 }/>,
        label: "Listas",
        path: "list",
    },
    {
        icon: <Contact size={ 25 }/>,
        label: "Contatos",
        path: "users",
    },
    {
        icon: <MessageSquare size={ 25 }/>,
        label: "Templates",
        path: "action-type",
    },
] satisfies NavigationTab[];
