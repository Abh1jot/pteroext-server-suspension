import { definePterodactylExtension } from '@pterodactyl/sdk';
import './styles.css';

export default definePterodactylExtension({
    setup({ screens }) {
        screens.register('admin-suspension', () => import('./screens/SuspensionScreen'));
    },
});
