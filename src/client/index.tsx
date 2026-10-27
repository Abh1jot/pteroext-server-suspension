import SuspensionScreen from './screens/SuspensionScreen';
import { definePterodactylExtension } from '@pterodactyl/sdk';
import ServerSuspensionBanner from './components/ServerSuspensionBanner';
import './styles.css';

export default definePterodactylExtension({
    setup({ screens, slots }) {
        screens.register('admin-suspension', () => Promise.resolve({ default: SuspensionScreen }));
        slots.register('server.console.before', ServerSuspensionBanner);
    },
});
