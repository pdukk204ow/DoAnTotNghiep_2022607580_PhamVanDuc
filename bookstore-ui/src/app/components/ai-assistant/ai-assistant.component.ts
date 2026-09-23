import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AiService } from 'src/app/services/ai.service';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  formattedText?: string;
}

@Component({
  selector: 'app-ai-assistant',
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.scss']
})
export class AiAssistantComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  isOpen = false;
  userInput = '';
  isLoading = false;

  messages: Message[] = [
    {
      text: 'Xin chào! Tôi là Trợ Lý Ảo Nhà Sách Văn Đức 📚. Tôi có thể giúp bạn tìm kiếm sách theo thể loại, tác giả, giá bán hoặc giải đáp về voucher, giao hàng và các chính sách của cửa hàng. Hôm nay bạn muốn tìm cuốn sách nào?',
      isUser: false,
      timestamp: new Date()
    }
  ];

  suggestions = [
    'Gợi ý sách lập trình 💻',
    'Sách bán chạy nhất 🔥',
    'Tìm sách kinh tế 📈',
    'Mã giảm giá hiện có 🎁'
  ];

  constructor(private aiService: AiService, private router: Router) { }

  ngOnInit(): void {
    this.messages[0].formattedText = this.formatMessage(this.messages[0].text);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  clearChat() {
    this.messages = [
      {
        text: 'Xin chào! Tôi là Trợ Lý Ảo Nhà Sách Văn Đức 📚. Tôi có thể giúp bạn tìm kiếm sách theo thể loại, tác giả, giá bán hoặc giải đáp về voucher, giao hàng và các chính sách của cửa hàng. Hôm nay bạn muốn tìm cuốn sách nào?',
        isUser: false,
        timestamp: new Date()
      }
    ];
    this.messages[0].formattedText = this.formatMessage(this.messages[0].text);
  }

  sendMessage(text?: string) {
    const msgText = text ? text.trim() : this.userInput.trim();
    if (!msgText || this.isLoading) return;

    // Chuẩn bị lịch sử trò chuyện (tối đa 6 tin nhắn gần nhất) để AI hiểu ngữ cảnh đối thoại liên tục
    const history = this.messages
      .filter(m => m.text)
      .slice(-6)
      .map(m => ({
        role: m.isUser ? 'user' : 'model',
        text: m.text
      }));

    this.messages.push({
      text: msgText,
      isUser: true,
      timestamp: new Date()
    });

    if (!text) {
      this.userInput = '';
    }

    this.isLoading = true;

    this.aiService.chatWithAi(msgText, history).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const aiResponse = res.response || 'Xin lỗi, tôi không thể xử lý câu trả lời này.';
        this.messages.push({
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
          formattedText: this.formatMessage(aiResponse)
        });
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Lỗi gọi AI:', err);
        const errMsg = 'Xin lỗi, đã có lỗi kết nối xảy ra. Vui lòng thử lại sau.';
        this.messages.push({
          text: errMsg,
          isUser: false,
          timestamp: new Date(),
          formattedText: this.formatMessage(errMsg)
        });
      }
    });
  }

  selectSuggestion(suggestion: string) {
    this.sendMessage(suggestion);
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  onChatClick(event: MouseEvent) {
    if (!event) return;
    const target = event.target as HTMLElement;
    if (target && target.classList.contains('book-link')) {
      event.preventDefault();
      const productId = target.getAttribute('data-id');
      if (productId) {
        this.router.navigate(['/product-detail', productId]);
        this.isOpen = false;
      }
    }
  }

  formatMessage(text: string): string {
    if (!text) return '';

    let formatted = text;

    formatted = formatted
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic *text*
    formatted = formatted.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g, '$1<em>$2</em>$3');

    // Link [Tên sách](/product-detail/ID)
    formatted = formatted.replace(
      /\[(.*?)\]\(\/product-detail\/(\d+)\)/g,
      '<a href="/product-detail/$2" class="book-link" data-id="$2">$1</a>'
    );

    // Link thông thường khác
    formatted = formatted.replace(
      /\[(.*?)\]\(((?!_link)(?!data-id).*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Xử lý danh sách gạch đầu dòng (- hoặc *)
    const lines = formatted.split('\n');
    let inList = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const content = line.substring(2).trim();
        if (!inList) {
          lines[i] = '<ul><li>' + content + '</li>';
          inList = true;
        } else {
          lines[i] = '<li>' + content + '</li>';
        }
      } else {
        if (inList) {
          lines[i] = '</ul>' + lines[i];
          inList = false;
        }
      }
    }
    if (inList) {
      lines[lines.length - 1] = lines[lines.length - 1] + '</ul>';
    }
    formatted = lines.join('\n');
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
  }
}
