import { importSPKI } from "jose";
import { getRevolutionConfig } from "../revolution/config";

//Defaults
const SANDBOX_ID = "9dce297e-b3c9-44f4-8006-8d5927c59954";
const DYNAMIC_SANDBOX_KEY =
  "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA2Q1XKUVZ7Dy0NRwbCgPl\n+NOiZeSZRu5cVB+N63HiHvTZ5DEfRQUDoEDNtlAzj0syikG55AyKu9aJyy18lTMi\ntiznJE4u7YuwpXtSbQmlGuuk2uKr7tistpPcELA5u9ca0cvysPF6QqMYO8dxJ+gI\nmYyF9a52Vcfmt13VEGUWgUTNrNJQo/KtmRJ+ZranuPPIN1kL4+Du07oXrH45MmiH\nA6knZdqT8xvQ46nE4t71BDRpJPDR8exwt+Frxsi2kp8E6a+qjrERi5fFtoP+Wmjm\nYyJSTF40QlnPWQ9PCJNOlCkG0/Ana4AW+PZdxofyLSrc3SKApm8851IbZU/pDHjh\nzuJzyvFY+3B9XmP0RK+Y3oNKl6a8lY9vtY/WyLCXgliXwCEW3D+TBrgsCQ3kZvG2\nm95PhAVyIxIDcu7NZef2iQnO01bTVKqpTTEy6iyhgciZdEW7iD70y4ulEt+F2bBc\n95G/ljQNpGVJNzMNpvll7vxEhUyMI+1DlUqdQ0zbEdq3LT3vdOo/+DOghZSJDi4q\nBNWTOx1KBaT9gsiHLHNZegYvlsaLy/Ai0NPz26ZMjvJYRhk0u0Ud5AUW20T/BKQk\nGffqAEVQOme8FVF5d726xBf3y4R9QTsn6qiTKS5InhN7uCwUnG+hZo21wwfQXbT8\n0ukfmzJUD93GJhArVOSWDmsCAwEAAQ==\n-----END PUBLIC KEY-----";
const DYNAMIC_LIVE_KEY =
  "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAyx/JxnNccxzLmJpOYw+7\n2Wspo4xgV2RanbGYMCk5zOXXY1y0nGlZzNDhVpRtVHxwDlWUQCaFj9iYlxBspFBp\nfJkXJnBHSdQV5IkGXNbOYHS/u00QEc8ZbyE1y3c1Muj2OCZ/+IZ1QwkUCMV2u0ih\nIYXWrqndvATuWXASOX9LmKUBsTqFzgRDv223J7/kpPVwSDxKDnhQ0AjSPeXzlTvU\ngMAGoINfhVgXWSxdLGt1CHsxGpepCs3O6DsS1LYtxlWxOc8MGGs4/CllkhrpnlBj\nM4y6YAo++VuB7Dkvs7SKb2jRd1OGyJvbDxsHpit+agFRq8YKarpgBDywv3w0ubU2\nCHSGPZNqv5mcBeFQetHBRjpfysbEne0PnJcm2qPcW0Of9eulwVTPd6xjpfQzBo7p\nzsVieDt6m7dlKEZlmstmMAr0lLoxEn/mE8BYFlHV5RfB1RYS6Gdcl810c8ECE05F\nNC9/eSzvs59+YWDyVOQgNv6CBhNUILp7Qif7A2x5g0uVXboZCbhlAYsNVWG8+rFQ\nnL/r1ZUge6P60hYrH1VelN4d3vysKL+XgA7YKgSuyUMDq4d6CvWTnqvY5j+bHslw\nZMhf5r8ivtC3XylcKAit9oqcBn0xtiNJphGjqUVr1LT/F4QAh1f2o6vt3OVL2XIP\n5C3gTa4EajAEUVXZ3RatlEkCAwEAAQ==\n-----END PUBLIC KEY-----";

const DEFAULT_ENVIRONMENT_ID = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || SANDBOX_ID;

export const getDynamicEnvironmentId = (revolutionId: string) => {
  const { auth } = getRevolutionConfig(revolutionId);

  return auth?.dynamic?.environmentId || DEFAULT_ENVIRONMENT_ID;
};

export const getDynamicConfig = (revolutionId: string) => {
  return {
    appLogoUrl: "https://co.build/images/revolution.jpg",
    appName: getRevolutionConfig(revolutionId).name,
    environmentId: getDynamicEnvironmentId(revolutionId),
    privacyPolicyUrl: `https://thatsgnar.ly/${revolutionId}/info/privacy`,
    termsOfServiceUrl: "https://thatsgnar.ly/tos.pdf",
    multiWallet: false,
  };
};

export const getEnvType = (): "sandbox" | "live" => {
  return DEFAULT_ENVIRONMENT_ID === SANDBOX_ID ? "sandbox" : "live";
};

export const getPublicKey = async (revolutionId?: string) => {
  let spki = getEnvType() === "live" ? DYNAMIC_LIVE_KEY : DYNAMIC_SANDBOX_KEY;

  //custom dynamic app
  if (revolutionId) {
    const { auth } = getRevolutionConfig(revolutionId);
    const { dynamic } = auth || {};
    if (dynamic) {
      const { publicKey } = dynamic;
      spki = publicKey;
    }
  }

  return await importSPKI(spki, "RS256");
};
