CREATE INDEX "Product_status_displayOrder_idx" ON "Product"("status", "displayOrder");
CREATE INDEX "Product_categoryId_status_idx" ON "Product"("categoryId", "status");
CREATE INDEX "Product_subcategoryId_status_idx" ON "Product"("subcategoryId", "status");
CREATE INDEX "Product_isFeatured_status_idx" ON "Product"("isFeatured", "status");
CREATE INDEX "Product_updatedAt_idx" ON "Product"("updatedAt");
CREATE INDEX "Collection_updatedAt_idx" ON "Collection"("updatedAt");
