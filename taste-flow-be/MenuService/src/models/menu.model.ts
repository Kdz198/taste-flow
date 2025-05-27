import mongoose from 'mongoose';


interface IMenu {
    name: string;
    price: number;
    status?: boolean;
    category: mongoose.Types.ObjectId[];
    receipt: {
        idIngredient: number;
        quantity: number;
    }[];
}

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: Boolean,
        default: true,
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }],
    receipt: [
        {
            idIngredient: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        }
    ]
});

const Menu = mongoose.model<IMenu>('Menu', menuSchema);
export { IMenu, Menu };
export default Menu;