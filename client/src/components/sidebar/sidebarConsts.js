import AddTaskIcon from '@mui/icons-material/AddTask';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddchartIcon from '@mui/icons-material/Addchart';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EditIcon from '@mui/icons-material/Edit';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import BookIcon from '@mui/icons-material/Book';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import SchoolIcon from '@mui/icons-material/School';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import TaskIcon from '@mui/icons-material/Task';

export const sidebarConsts = {
    information: [
        {
            title: "Students",
            path: "/admin/students",
            icon: GroupIcon,
            user: "admin",
        },
        {
            title: "Faculties",
            path: "/admin/faculties",
            icon: PersonOutlineIcon,
            user: "admin",
        },
        {
            title: "Updates",
            path: "/admin/updates",
            icon: NotificationsIcon,
            user: "admin",
        },
        {
            title: "Updates",
            path: "/faculty/updates",
            icon: NotificationsIcon,
            user: "faculty",
        },
        {
            title: "Courses",
            path: "/admin/courses",
            icon: CollectionsBookmarkIcon,
            user: "admin",
        },
        {
            title: "Classes",
            path: "/admin/classes",
            icon: SchoolIcon,
            user: "admin",
        },
        {
            title: "Timetables",
            path: "/admin/timetables",
            icon: ViewTimelineIcon,
            user: "admin",
        },    
        {
            title: 'Calender',
            getPath: (user) => `/${user.role}/calender`,
            icon: CalendarMonthIcon,
            user: 'both'
        },
        {
            title: "Attendance",
            path: "/faculty/attendance",
            icon: CoPresentIcon,
            user: 'faculty'
        },
        {
            title: "Students",
            path: '/faculty/class/students',
            icon: GroupsIcon,
            user: 'faculty'
        },
        {
            title: "Marks",
            path: '/faculty/marks',
            icon: AssessmentIcon,
            user: 'faculty'
        },
        {
            title: "Tasks",
            getPath: (user) => `/${user.role}/tasks`,
            icon: TaskIcon,
            user: 'both'
        },
        {
            title: "Tests",
            getPath: (user) => `/${user.role}/tests`,
            icon: NoteAddIcon,
            user: 'both'
        },
        {
            title: "Responses",
            path: "/student/responses",
            icon: MarkChatReadIcon,
            user: 'student'
        },
    ],
    create: [
        {
            title: "Create Student",
            path: "/admin/students/new",
            icon: GroupAddIcon,
            user: "admin",
        },
        {
            title: "Create Faculty",
            path: "/admin/faculties/new",
            icon: PersonAddIcon,
            user: "admin",
        },
        {
            title: "Create Update",
            path: "/admin/updates/new",
            icon: NotificationAddIcon,
            user: "admin",
        },
        {
            title: "Create Update",
            path: "/faculty/updates/new",
            icon: NotificationAddIcon,
            user: "faculty",
        },
        {
            title: "Create Course",
            path: "/admin/courses/new",
            icon: BookIcon,
            user: "admin",
        },
        {
            title: "Create Timetable",
            path: "/admin/timetables/new",
            icon: MoreTimeIcon,
            user: "admin",
        },
        {
            title: "Classes",
            path: "/admin/classes/new",
            icon: AddModeratorIcon,
            user: "admin"
        },
        {
            title: "Tasks",
            path: '/faculty/tasks/new',
            icon: AddTaskIcon,
            user: 'faculty'
        },
        {
            title: "Tests",
            path: '/faculty/tests/new',
            icon: PostAddIcon,
            user: 'faculty'
        },
        {
            title: "Attendance",
            path: '/faculty/attendance/new',
            icon: PlaylistAddIcon,
            user: 'faculty'
        },
        {
            title: "Marks",
            path: '/faculty/marks/new',
            icon: AddchartIcon,
            user: 'faculty'
        },
    ],
    user: [
        {
            title: 'Profile',
            getPath: (user) => `/${user.role}/single/${user._id}`,
            icon: AccountCircleOutlinedIcon,
            user: 'both'
        },
        {
            title: 'Edit Profile',
            getPath: (user) => `/${user.role}/edit/${user._id}`,
            icon: EditIcon,
            user: 'both',
        }
    ]
}
