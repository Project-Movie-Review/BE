import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/models';
import path from 'path';
import fs from 'fs';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ImageService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User
    ) { }

    private async checkImageInUse(imageUrl: string) {
        const userImage = await this.userModel.findOne({ where: { avatar: imageUrl } });
        if (userImage) {
            return true;
        } else {
            return false;
        }
    }

    async uploadImages(imageUrls: Express.Multer.File[] | Express.Multer.File) {
        if (!imageUrls) {
            return {
                message: 'Không có file nào được tải lên'
            };
        }

        const files = Array.isArray(imageUrls) ? imageUrls : [imageUrls];

        if (files.length === 0) {
            return {
                message: 'Không có file nào được tải lên'
            };
        }

        const uploadedImagesPath = files.map(file => {
            return path.basename(file.path).trim();
        });

        return {
            message: 'Tải lên thành công',
            images: uploadedImagesPath
        };
    }

    async viewImage(imageName: string) {
        const imagePath = path.join(process.cwd(), 'src/uploads', imageName);
        if (!fs.existsSync(imagePath)) {
            throw new BadRequestException('File không tồn tại');
        }
        return imagePath;
    }

    async deleteImage(imageName: string) {
        const checkInUse = await this.checkImageInUse(imageName);
        if (checkInUse) {
            throw new BadRequestException('File đang được sử dụng, không thể xóa');
        }
        if (imageName && !imageName.startsWith('http://') && !imageName.startsWith('https://')) {
            const filePath = path.join(process.cwd(), 'src/uploads', imageName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return {
                message: 'Xóa ảnh thành công'
            }
        } else {
            throw new BadRequestException('File không tồn tại hoặc không phải là file hợp lệ');
        }
    }
}
