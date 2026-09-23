package vn.fs.api;

import java.io.File;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import vn.fs.entity.Product;
import vn.fs.repository.ProductRepository;

@CrossOrigin("*")
@RestController
@RequestMapping("api/ai")
public class AiApi {

	@Autowired
	ProductRepository productRepo;

	@Value("${gemini.api.key:}")
	private String apiKeyProperty;

	private final RestTemplate restTemplate;

	private static final String[] GEMINI_MODELS = {
			"gemini-robotics-er-2-preview",
			"gemini-3-flash-preview",
			"gemini-flash-latest"
	};

	public AiApi() {
		SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
		factory.setConnectTimeout(5000);
		factory.setReadTimeout(18000);
		this.restTemplate = new RestTemplate(factory);
	}

	@PostMapping("/chat")
	public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> request) {
		String userMessage = request != null && request.containsKey("message") ? String.valueOf(request.get("message"))
				: null;
		if (userMessage == null || userMessage.trim().isEmpty()) {
			Map<String, String> err = new HashMap<>();
			err.put("response",
					"Xin chào! Tôi là Trợ Lý Ảo của Nhà sách Văn Đức 📚. Tôi có thể giúp gì cho bạn hôm nay?");
			return ResponseEntity.ok(err);
		}

		List<Product> products = productRepo.findByStatusTrue();
		String answer = null;
		String apiKey = getGeminiApiKey();

		List<Map<String, String>> history = null;
		if (request.containsKey("history") && request.get("history") instanceof List) {
			try {
				history = (List<Map<String, String>>) request.get("history");
			} catch (Exception ignored) {
			}
		}

		if (apiKey != null && !apiKey.trim().isEmpty() && !apiKey.equals("YOUR_API_KEY")) {
			for (String model : GEMINI_MODELS) {
				try {
					answer = callGeminiApi(userMessage, history, products, apiKey, model);
					if (answer != null && !answer.trim().isEmpty()) {
						break;
					}
				} catch (Exception e) {
					System.err.println("Gemini model [" + model + "] error: " + e.getMessage());
				}
			}
		}

		if (answer == null || answer.trim().isEmpty()) {
			answer = "Xin lỗi bạn, trợ lý AI hiện đang bận hoặc gặp sự cố kết nối tạm thời. Bạn vui lòng thử lại sau giây lát nhé!";
		}

		Map<String, String> response = new HashMap<>();
		response.put("response", answer);
		return ResponseEntity.ok(response);
	}

	private String getGeminiApiKey() {
		String apiKey = apiKeyProperty;
		if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equals("YOUR_API_KEY") || apiKey.startsWith("${")) {
			apiKey = System.getenv("GEMINI_API_KEY");
		}
		if (apiKey == null || apiKey.trim().isEmpty()) {
			apiKey = System.getenv("GOOGLE_API_KEY");
		}
		if (apiKey == null || apiKey.trim().isEmpty()) {
			try {
				File keyFile = new File("gemini-key.txt");
				if (!keyFile.exists()) {
					keyFile = new File("src/main/resources/gemini-key.txt");
				}
				if (keyFile.exists()) {
					apiKey = new String(Files.readAllBytes(keyFile.toPath())).trim();
				}
			} catch (Exception ignored) {
			}
		}
		return apiKey;
	}

	private String callGeminiApi(String userMessage, List<Map<String, String>> history, List<Product> products,
			String apiKey, String modelName) {
		String url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key="
				+ apiKey;

		StringBuilder catalogBuilder = new StringBuilder();
		for (Product p : products) {
			double finalPrice = p.getPrice() * (100 - p.getDiscount()) / 100;
			String categoryName = p.getCategory() != null ? p.getCategory().getCategoryName() : "Khác";
			catalogBuilder.append(
					String.format("- [%s](/product-detail/%d) | TG: %s | TL: %s | Giá: %,.0f đ (Gốc: %,.0f đ)\n",
							p.getName(),
							p.getProductId(),
							p.getAuthor() != null ? p.getAuthor() : "Chưa cập nhật",
							categoryName,
							finalPrice,
							p.getPrice()));
		}

		StringBuilder si = new StringBuilder();
		si.append("Bạn là trợ lý ảo tư vấn thông minh, tận tâm và thân thiện của Nhà sách Văn Đức.\n\n");
		si.append("DƯỚI ĐÂY LÀ DANH MỤC TOÀN BỘ CÁC ĐẦU SÁCH ĐANG CÓ SẴN TẠI NHÀ SÁCH VĂN ĐỨC:\n");
		si.append(catalogBuilder.toString()).append("\n");
		si.append("HƯỚNG DẪN & NGUYÊN TẮC BẮT BUỘC:\n");
		si.append(
				"1. Giao tiếp bằng tiếng Việt lịch sự, thân thiện, xưng 'mình' hoặc 'Nhà sách Văn Đức', gọi khách là 'bạn' hoặc 'quý khách'.\n");
		si.append(
				"2. BẮT BUỘC dùng link Markdown [Tên Sách](/product-detail/ID) mỗi khi nhắc đến hoặc giới thiệu bất kỳ cuốn sách nào để khách có thể bấm xem chi tiết và mua ngay.\n");
		si.append("3. NGHỆ THUẬT DẪN DẮT ĐẾN ĐẦU SÁCH:\n");
		si.append(
				"   - Khi khách hỏi bất kỳ câu hỏi nào ngoài lề, chuyện phiếm, đời sống, thời gian, câu hỏi vui, tâm sự (ví dụ: 'bao giờ đến tết', 'hôm nay ăn gì', 'buồn quá', 'làm sao để giàu', 'bạn có người yêu chưa'...):\n");
		si.append("     + Bước 1: Hãy trò chuyện tự nhiên, dí dỏm, trả lời khéo léo hoặc thấu cảm với khách trước.\n");
		si.append(
				"     + Bước 2: BẮT BUỘC khéo léo DẪN DẮT liên hệ chủ đề đó đến 1 hoặc 2 cuốn sách phù hợp đang có sẵn trong danh mục của nhà sách để khách tham khảo.\n");
		si.append("4. TÍNH TRUNG THỰC:\n");
		si.append("   - Chỉ tư vấn sách thực sự có trong danh mục trên.\n");
		si.append(
				"   - Nếu khách hỏi sách hoặc thể loại nhà sách không có (như sách nấu ăn, truyện tranh không có trong danh sách): Phải thành thật thông báo chưa có trong kho, sau đó gợi ý sách hay có sẵn gần gũi nhất. Tuyệt đối không bịa đặt sách.\n");
		si.append("5. CHÍNH SÁCH NHÀ SÁCH:\n");
		si.append("   - Voucher: VANDUC (giảm 20% tối đa 50k từ 100k), VANDUC10 (giảm 10% tối đa 30k từ 150k).\n");
		si.append("   - Giao hàng: Toàn quốc 2-4 ngày, Freeship từ 300.000đ.\n");
		si.append("   - Đổi trả: 7 ngày nếu lỗi nhà sản xuất.\n");
		si.append("   - Thanh toán: COD (tiền mặt khi nhận hàng) hoặc qua VNPay.\n");
		si.append("6. ĐỊNH DẠNG: Trình bày gãy gọn, dùng gạch đầu dòng dấu trừ '-', in đậm, emoji vui tươi.");

		Map<String, Object> requestBody = new HashMap<>();

		List<Map<String, Object>> contents = new ArrayList<>();
		if (history != null && !history.isEmpty()) {
			int startIndex = Math.max(0, history.size() - 6);
			for (int i = startIndex; i < history.size(); i++) {
				Map<String, String> item = history.get(i);
				String role = item.get("role");
				String text = item.get("text");
				if (text != null && !text.trim().isEmpty()) {
					Map<String, Object> c = new HashMap<>();
					c.put("role", "model".equalsIgnoreCase(role) ? "model" : "user");
					List<Map<String, Object>> parts = new ArrayList<>();
					Map<String, Object> p = new HashMap<>();
					p.put("text", text);
					parts.add(p);
					c.put("parts", parts);
					contents.add(c);
				}
			}
		}

		Map<String, Object> currentContent = new HashMap<>();
		currentContent.put("role", "user");
		List<Map<String, Object>> currentParts = new ArrayList<>();
		Map<String, Object> currentPart = new HashMap<>();
		currentPart.put("text", userMessage);
		currentParts.add(currentPart);
		currentContent.put("parts", currentParts);
		contents.add(currentContent);

		requestBody.put("contents", contents);

		Map<String, Object> systemInstructionMap = new HashMap<>();
		List<Map<String, Object>> siParts = new ArrayList<>();
		Map<String, Object> siPart = new HashMap<>();
		siPart.put("text", si.toString());
		siParts.add(siPart);
		systemInstructionMap.put("parts", siParts);
		requestBody.put("systemInstruction", systemInstructionMap);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

		ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
		Map<String, Object> responseBody = response.getBody();

		if (responseBody != null) {
			List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
			if (candidates != null && !candidates.isEmpty()) {
				Map<String, Object> candidate = candidates.get(0);
				Map<String, Object> responseContent = (Map<String, Object>) candidate.get("content");
				if (responseContent != null) {
					List<Map<String, Object>> resParts = (List<Map<String, Object>>) responseContent.get("parts");
					if (resParts != null) {
						for (Map<String, Object> p : resParts) {
							if (p.containsKey("text")) {
								String text = (String) p.get("text");
								if (text != null && !text.trim().isEmpty()) {
									return text;
								}
							}
						}
					}
				}
			}
		}

		return null;
	}
}
