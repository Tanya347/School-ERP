import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import SchoolIcon from '@mui/icons-material/School';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';

export const ADMIN_WIDGETS = [
  {
    key: 'student',
    label: 'Students',
    link: '/admin/students',
    Icon: SchoolIcon,
    bg: 'var(--light-green)',
    color: 'var(--green)',
  },
  {
    key: 'teacher',
    label: 'Teachers',
    link: '/admin/faculties',
    Icon: EmojiPeopleIcon,
    bg: 'var(--light-blue)',
    color: 'var(--blue)',
  },
  {
    key: 'subject',
    label: 'Subjects',
    link: '/admin/courses',
    Icon: LibraryBooksIcon,
    bg: 'var(--light-purple)',
    color: 'var(--purple)',
  },
  {
    key: 'class',
    label: 'Classes',
    link: '/admin/classes',
    Icon: PeopleIcon,
    bg: 'var(--light-pink)',
    color: 'var(--pink)',
  },
];
