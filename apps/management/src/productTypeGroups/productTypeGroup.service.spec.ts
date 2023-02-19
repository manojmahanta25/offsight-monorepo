import { Test, TestingModule } from "@nestjs/testing";
import { ProductTypeGroupService } from "./productTypeGroup.service";
import { ModelMockerFunction } from "@app/model/Mock/modelMockerFunction";

describe("UsergroupService", () => {
  let service: ProductTypeGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductTypeGroupService],
    })
      .useMocker(ModelMockerFunction)
      .compile();

    service = module.get<ProductTypeGroupService>(ProductTypeGroupService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should get product type group", async () => {
    const result = service.getAll(1);
    await expect(result).resolves.not.toBeNull();
  });

  it("should create product type group", async () => {
    const payload = {
      product_type_group_name: "Product Type Group 1",
    };
    const result = service.createProductTypeGroup(1, payload);
    await expect(result).resolves.not.toBeNull();
  });

  it("should update product type group", async () => {
    const payload = {
      product_type_group_name: "Product Type Group 1",
    };
    const result = service.updateProductTypeGroup({ product_type_group_id: 1, client_id: 1 }, payload);
    await expect(result).resolves.not.toBeNull();
  });
});
