CHANGELOG
===================
* v1.0.0RC4 (2016-06-09)
  * Adição do plugin splashscreen (Para eliminar splash após primeiro carregamento)

* v1.0.0RC3 (2016-05-20)
  * Vinculação de backbutton do device agora só depende de registerOnBack
  * Implementação de preventable no método onBack.

* v1.0.0RC2 (2016-04-27)
  * feature [Retirando evento 'push'] #11
  * adicao Plugin Preload

* v1.0.0RC (2016-04-24)
  * Refactoring da correção do iOS (realizada na v0.0.18) 
  * revert [Revertendo comportamento da v0.0.18]

* v0.0.19 (2016-04-18)
  * feature fix [Adição de evento 'back' para viewport ativa]
  * revert [Revertendo comportamento da v0.0.18]

* v0.0.18 (2016-04-17)
  * adicionando métodos na viewport para forçar ações show/hide do teclado.
  * adicionando dependência do plugin do teclado.
  * resolvendo problema de scrollToField nos aparelhos iOS.

* v0.0.17 (2016-04-13)
  * bug fix [Block backbutton register]

* v0.0.16 (2016-04-02)
  * bug fix [Ignorar Toast autoNavigation] #10

* v0.0.15 (2016-03-29)
 * bug fix [Confirm limpa stack] #9

* v0.0.14 (2016-03-23)

 * bug fix [Adicionar showMenu() e hideMenu() para navegação auto] #6
 * feature [Adição de evento backbutton] #7
 * feature [Adição de evento 'push'] #8

* v0.0.13 (2016-03-21)

 * feature [adição navegação backbutton com modal] #4

* v0.0.12 (2016-03-21)

 * bug fix [Deleção objeto criado pelo prototype via config no app.js] ed0066d
 * bug fix [Correção condição clearNavigation] c0915ad
 * bug fix [Refatorar clearNavigation automático] #3