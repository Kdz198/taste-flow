import moongoose from 'mongoose';
interface ICategory {
    name: string;
    description: string;
    status?: boolean;
}
// Define the schema for the Category model
const cateSchema = new moongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    }
});
const Category = moongoose.model<ICategory>('Category', cateSchema);

export { ICategory, Category };
export default Category;