const refs = {
    formBox: document.querySelector('.form'),
    form: document.querySelector('#form'),
    formImage: document.querySelector('#formImage'),
    filePreview: document.querySelector('.file__preview'),
};

document.addEventListener('DOMContentLoaded', () => {
    refs.form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(refs.form);

        let formData = new FormData(refs.form);
        formData.append('image', formImage.files[0]);

        if (error === 0) {
            refs.formBox.classList.add('_sending');
            let response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                let result = await response.json();
                alert(result.message);
                refs.filePreview.innerHTML = '';
                refs.form.reset();
                refs.formBox.classList.remove('_sending');
            } else {
                alert('Ошибка');
                refs.formBox.classList.remove('_sending');
            }
        } else {
            alert('Заполните обязательные поля');
        }
    }
    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req');

        formReq.forEach(input => {
            formRemoveError(input);

            if (input.classList.contains('_email')) {
                if (emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if (input.getAttribute('type') === 'checkbox' && input.checked === false) {
                formAddError(input);
                error++;
            } else {
                if(input.value === '') {
                    formAddError(input);
                    error++; 
                }
            }
        });
        return error;
    }

    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }
    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }
    //функция теста емаил
    function emailTest (input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }

    //слуашем изм в инпуте файл
    refs.formImage.addEventListener('change', () => {
        uploadFile(refs.formImage.files[0]);
    });

    function uploadFile(file) {
        //type file
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            alert('Разрешены только изображения');
            refs.formImage.value = '';
            return;
        }
        //size file <2mb
        if (file.size > 2 * 1024 * 1024) {
            alert('Файл должен быть менее 2 МБ');
            return;
        }

        let reader = new FileReader();
        reader.onload = function (e) {
            refs.filePreview.innerHTML = `<img src="${e.target.result}" alt="Photo">`
        };
        reader.onerror = function (e) {
            alert('Ошибка');
        };
        reader.readAsDataURL(file);
    }
});

