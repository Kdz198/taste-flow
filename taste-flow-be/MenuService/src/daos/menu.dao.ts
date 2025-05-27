import { IMenu } from "../models/menu.model";
import { Menu } from "../models/menu.model";

function addMenu(menuData: IMenu): Promise<IMenu> {
    return new Promise((resolve, reject) => {
        const newMenu = new Menu(menuData);
        newMenu.save()
            .then((savedMenu) => {
                resolve(savedMenu);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function addMenus(menusData: IMenu[]): Promise<IMenu[]> {
    return new Promise((resolve, reject) => {
        Menu.insertMany(menusData)
            .then((savedMenus) => {
                resolve(savedMenus);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function getMenuById(menuId: string): Promise<IMenu | null> {
    return new Promise((resolve, reject) => {
        Menu.findById(menuId)
            .then((menu) => {
                resolve(menu);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function getAllMenus(): Promise<IMenu[]> {
    return new Promise((resolve, reject) => {
        Menu.find()
            .then((menus) => {
                resolve(menus);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function updateMenu(menuId: string, menuData: Partial<IMenu>): Promise<IMenu | null> {
    return new Promise((resolve, reject) => {
        Menu.findByIdAndUpdate(menuId, menuData, { new: true })
            .then((updatedMenu) => {
                resolve(updatedMenu);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function deleteMenu(menuId: string): Promise<IMenu | null> {
    return new Promise((resolve, reject) => {
        Menu.findByIdAndDelete(menuId)
            .then((deletedMenu) => {
                resolve(deletedMenu);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export {
    addMenu,
    addMenus,
    getMenuById,
    getAllMenus,
    updateMenu,
    deleteMenu
};