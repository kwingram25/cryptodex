import { ORM } from 'redux-orm';

import Address from './addresses';

const orm = new ORM();
orm.register(Address);

export default orm;
