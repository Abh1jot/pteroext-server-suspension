import { definePterodactylExtension } from '@pterodactyl/sdk';
import ServerSuspensionBanner from './components/ServerSuspensionBanner';
import './styles.css';

export default definePterodactylExtension({
    setup({ screens, slots }) {
        screens.register('admin-suspension', () => import('./screens/SuspensionScreen'));
        slots.register('server.console.before', ServerSuspensionBanner);
    },
});
