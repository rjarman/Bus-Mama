import { App } from './libs/Application';
import { HANDLERS_PATH } from './config';

import {
  BodyParser,
  BodyParserURLEncoded,
  Permissions,
} from './middleware/CommonMiddleware';
import { Watcher } from './middleware/WatcherMiddleware';

import { Index } from './handlers/IndexHandler';
import { Bus } from './handlers/BusHandler';
import { Profile } from './handlers/ProfileHandler';

const application = new App({
  middleware: [BodyParser, BodyParserURLEncoded, Permissions, Watcher],
  assetsPath: ['./../../public'],
  handlerModule: [
    { path: HANDLERS_PATH.root, handler: Index },
    { path: HANDLERS_PATH.bus, handler: Bus },
    { path: HANDLERS_PATH.profile, handler: Profile },
  ],
});
application.listen();
